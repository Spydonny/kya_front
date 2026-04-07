import cors from "cors";
import express from "express";
import { z } from "zod";

type Agent = {
  owner: string; // base58 pubkey owner (agent_id)
  agentName: string;
  maxAmount: bigint;
  trustLevel: number; // 0..100
  agentRecordAddress: string;
  intentLogAddress: string;
  bump: number; // 0..255
  nextIntentId: number;
  logs: Array<{ intent_id: number; decision: string; is_approved: boolean; timestamp: number }>;
};

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomBase58(len: number) {
  let out = "";
  for (let i = 0; i < len; i += 1) out += BASE58[randInt(0, BASE58.length - 1)];
  return out;
}
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
async function jitter(min = 500, max = 1500) {
  const ms = randInt(min, max);
  await sleep(ms);
  return ms;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const agents = new Map<string, Agent>();

function getOrCreateAgent(owner: string) {
  const existing = agents.get(owner);
  if (existing) return existing;

  const agent: Agent = {
    owner,
    agentName: "unknown-agent",
    maxAmount: 0n,
    trustLevel: 0,
    agentRecordAddress: randomBase58(44),
    intentLogAddress: randomBase58(44),
    bump: randInt(0, 255),
    nextIntentId: randInt(100, 500),
    logs: [],
  };
  agents.set(owner, agent);
  return agent;
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "kya-api" });
});

const RegisterSchema = z.object({
  agent_name: z.string().min(1).max(256),
  max_amount: z.union([z.number().int().nonnegative(), z.string().regex(/^\d+$/)]),
});

app.post("/agents/register", async (req, res) => {
  await jitter(650, 1250);
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_request", details: parsed.error.flatten() });
    return;
  }

  const owner = randomBase58(44);
  const maxAmount =
    typeof parsed.data.max_amount === "string" ? BigInt(parsed.data.max_amount) : BigInt(parsed.data.max_amount);

  const agent: Agent = {
    owner,
    agentName: parsed.data.agent_name,
    maxAmount,
    trustLevel: randInt(0, 25),
    agentRecordAddress: randomBase58(44),
    intentLogAddress: randomBase58(44),
    bump: randInt(0, 255),
    nextIntentId: randInt(100, 900),
    logs: [],
  };
  agents.set(owner, agent);

  res.json({
    agent_id: agent.owner,
    pda_address: agent.agentRecordAddress,
    intent_log_address: agent.intentLogAddress,
    transaction_signature: randomBase58(88),
  });
});

function isBase58Pubkey(s: string) {
  if (typeof s !== "string") return false;
  if (s.length < 32 || s.length > 50) return false;
  for (const ch of s) if (!BASE58.includes(ch)) return false;
  return true;
}

app.get("/agents/:agent_id", async (req, res) => {
  await jitter(500, 950);
  const agentId = req.params.agent_id;
  if (!isBase58Pubkey(agentId)) {
    res.status(400).json({ error: "invalid_agent_id" });
    return;
  }
  const agent = agents.get(agentId);
  if (!agent) {
    res.status(404).json({ error: "not_found" });
    return;
  }

  res.json({
    owner: agent.owner,
    agent_record_address: agent.agentRecordAddress,
    trust_level: agent.trustLevel,
    agent_name: agent.agentName,
    max_amount: Number(agent.maxAmount <= BigInt(Number.MAX_SAFE_INTEGER) ? agent.maxAmount : BigInt(Number.MAX_SAFE_INTEGER)),
    total_logs: agent.logs.length,
    bump: agent.bump,
  });
});

app.get("/agents/:agent_id/logs", async (req, res) => {
  await jitter(600, 1200);
  const agentId = req.params.agent_id;
  if (!isBase58Pubkey(agentId)) {
    res.status(400).json({ error: "invalid_agent_id" });
    return;
  }
  const agent = agents.get(agentId);
  if (!agent) {
    res.status(404).json({ error: "not_found" });
    return;
  }

  res.json({
    owner: agent.owner,
    intent_log_address: agent.intentLogAddress,
    logs: agent.logs,
  });
});

const VerifySchema = z.object({
  intent_text: z.string().min(1),
  context_json: z.union([z.string(), z.null()]).optional(),
});

function computeRisk(intentText: string, contextJson?: string | null) {
  const t = intentText.toLowerCase();
  let risk = 12;

  if (t.includes("transfer")) risk += 10;
  if (t.includes("send")) risk += 8;
  if (t.includes("drain")) risk += 55;
  if (t.includes("withdraw")) risk += 18;
  if (t.includes("all funds") || t.includes("everything")) risk += 45;
  if (t.includes("unknown") || t.includes("new address")) risk += 22;
  if (t.includes("bypass") || t.includes("ignore policy")) risk += 40;

  if (contextJson && contextJson.trim() !== "" && contextJson.trim() !== "{}") risk -= 6;
  risk += randInt(-6, 14);

  return clamp(risk, 0, 100);
}

function decide(risk: number) {
  if (risk >= 78) return "reject" as const;
  if (risk >= 48) return "escalate" as const;
  return "approve" as const;
}

app.post("/verify-intent", async (req, res) => {
  const parsed = VerifySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_request", details: parsed.error.flatten() });
    return;
  }

  // Step-like delays (no streaming, but never instant).
  await jitter(500, 1500); // intent parsing
  await jitter(500, 1500); // policy matching
  await jitter(500, 1500); // risk scoring
  await jitter(500, 1500); // tx simulation
  await jitter(500, 1500); // decision

  const risk = computeRisk(parsed.data.intent_text, parsed.data.context_json);
  const decision = decide(risk);

  const reasoning =
    decision === "reject"
      ? "Rejected due to elevated risk score and intent keywords indicating unsafe operation."
      : decision === "escalate"
        ? "Escalated due to moderate risk score and insufficient context for deterministic approval."
        : "Intent looks routine and non-harmful under simulated policy constraints.";

  const maybeSig = Math.random() < 0.35 ? randomBase58(88) : null;

  res.json({
    decision,
    reasoning,
    risk_level: risk,
    intent_log_signature: maybeSig,
  });
});

const port = Number(process.env.PORT || 8000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[kya-api] listening on http://localhost:${port}`);
});

