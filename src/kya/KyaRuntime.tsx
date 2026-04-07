import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AgentDecisionEvent, AgentRecord, ExplorerFeedItem, VerificationRequest, VerificationResult } from "./types";
import { seedAgents } from "./mockData";
import { registerAgent, runDecisionPipeline, toExplorerFeedItem } from "./mockServices";
import { loadJson, saveJson } from "./storage";

type ViewState =
  | { view: "landing" }
  | { view: "register" }
  | { view: "dashboard" }
  | { view: "agent"; agentId: string }
  | { view: "explorer" }
  | { view: "demo" };

type KyaState = {
  view: ViewState;
  agents: AgentRecord[];
  explorerFeed: ExplorerFeedItem[];
  activeVerification:
    | { agentId: string; result: VerificationResult | null; running: boolean; steps: VerificationResult["steps"] | null }
    | null;
};

type KyaActions = {
  navigate: (next: ViewState) => void;
  createAgent: (input: { name: string; description: string; transactionLimitSol: number }) => Promise<AgentRecord>;
  runVerification: (req: VerificationRequest) => Promise<VerificationResult>;
  selectAgent: (agentId: string) => void;
  resetDemo: () => void;
};

type KyaRuntime = KyaState & KyaActions;

const STORAGE_KEY = "kya_demo_runtime_v1";

const KyaContext = createContext<KyaRuntime | null>(null);

function newEventId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function computeCoverageDelta(decision: VerificationResult["decision"]) {
  const drift = decision === "approve" ? 0.8 : decision === "flag" ? 0.3 : -0.1;
  const noise = (Math.random() - 0.5) * 0.6;
  return drift + noise;
}

function hydrate() {
  const saved = loadJson<KyaState>(STORAGE_KEY);
  if (!saved) return null;
  if (!saved.agents?.length) return null;
  return saved;
}

export function KyaRuntimeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KyaState>(() => {
    const saved = hydrate();
    if (saved) return { ...saved, activeVerification: null };

    const bootstrapFeed: ExplorerFeedItem[] = [
      {
        id: "feed_boot_1",
        timestamp: Date.now() - 1000 * 60 * 2,
        agentId: seedAgents[0].id,
        agentName: seedAgents[0].name,
        action: "pay",
        amountSol: 0.023,
        recipient: "GpuS...rv1c",
        decision: "approve",
        reasonShort: "Known vendor, recurring pattern.",
        recordTag: "Verification record",
      },
      {
        id: "feed_boot_2",
        timestamp: Date.now() - 1000 * 60 * 11,
        agentId: seedAgents[2].id,
        agentName: seedAgents[2].name,
        action: "transfer",
        amountSol: 1.217,
        recipient: "3x7M...unkn",
        decision: "flag",
        reasonShort: "Unknown interaction pattern.",
        recordTag: "Verification record",
      },
    ];

    return {
      view: { view: "landing" },
      agents: seedAgents,
      explorerFeed: bootstrapFeed,
      activeVerification: null,
    };
  });

  useEffect(() => {
    const { activeVerification, ...persistable } = state;
    saveJson(STORAGE_KEY, persistable);
  }, [state]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((prev) => {
        // keep it subtle; don't spam when user is actively running a pipeline
        if (prev.activeVerification?.running) return prev;
        if (prev.agents.length === 0) return prev;

        const agent = prev.agents[Math.floor(Math.random() * prev.agents.length)];
        const action = (["transfer", "pay", "swap"] as const)[Math.floor(Math.random() * 3)];
        const amountSol = Number((Math.random() * 1.2 + 0.012).toFixed(3));
        const recipient = `${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`;
        const decision = (["approve", "reject", "flag"] as const)[Math.floor(Math.random() * 3)];
        const reasonShort =
          decision === "approve"
            ? "Policy match successful."
            : decision === "reject"
              ? "Policy hard-stop triggered."
              : "Moderate risk score.";

        const item: ExplorerFeedItem = {
          id: newEventId("feed"),
          timestamp: Date.now(),
          agentId: agent.id,
          agentName: agent.name,
          action,
          amountSol,
          recipient,
          decision,
          reasonShort,
          recordTag: "Verification record",
        };

        return { ...prev, explorerFeed: [item, ...prev.explorerFeed].slice(0, 30) };
      });
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const runtime: KyaRuntime = useMemo(() => {
    async function createAgent(input: { name: string; description: string; transactionLimitSol: number }) {
      const out = await registerAgent(input);
      setState((prev) => ({
        ...prev,
        agents: [out.agent, ...prev.agents],
        view: { view: "agent", agentId: out.agent.id },
      }));
      return out.agent;
    }

    function navigate(next: ViewState) {
      setState((prev) => ({ ...prev, view: next }));
    }

    function selectAgent(agentId: string) {
      setState((prev) => ({ ...prev, view: { view: "agent", agentId } }));
    }

    async function runVerification(req: VerificationRequest) {
      const agent = state.agents.find((a) => a.id === req.agentId);
      if (!agent) throw new Error("Agent not found");

      setState((prev) => ({ ...prev, activeVerification: { agentId: req.agentId, result: null, running: true, steps: null } }));

      const result = await runDecisionPipeline(agent, req, (steps) => {
        setState((prev) => {
          if (!prev.activeVerification || prev.activeVerification.agentId !== req.agentId) return prev;
          return { ...prev, activeVerification: { ...prev.activeVerification, steps } };
        });
      });

      const event: AgentDecisionEvent = {
        id: newEventId("evt"),
        timestamp: result.timestamp,
        decision: result.decision,
        action: result.request.action,
        amountSol: result.request.amountSol,
        recipient: result.request.recipient,
        reason: result.reason,
        riskScore: result.riskScore,
        txSig: result.txSig,
        steps: result.steps,
      };

      setState((prev) => {
        const agents = prev.agents.map((a) => {
          if (a.id !== req.agentId) return a;

          const nextTotalChecks = a.totalChecks + 1;
          const nextRejected = a.rejectedActions + (result.decision === "reject" ? 1 : 0);
          const nextCoverage = Math.max(8, Math.min(99, a.intentCoveragePct + computeCoverageDelta(result.decision)));
          const nextTrust = result.updatedTrustScore;
          const nextStatus: AgentRecord["status"] = nextTrust >= 80 ? "trusted" : nextTrust >= 62 ? "unknown" : "risky";

          return {
            ...a,
            trustScore: nextTrust,
            status: nextStatus,
            totalChecks: nextTotalChecks,
            rejectedActions: nextRejected,
            intentCoveragePct: Math.round(nextCoverage),
            decisionHistory: [event, ...a.decisionHistory].slice(0, 60),
          };
        });

        const updatedAgent = agents.find((a) => a.id === req.agentId) ?? agent;
        const feedItem = toExplorerFeedItem(updatedAgent, result);

        return {
          ...prev,
          agents,
          explorerFeed: [feedItem, ...prev.explorerFeed].slice(0, 30),
          activeVerification: { agentId: req.agentId, result, running: false, steps: result.steps },
        };
      });

      return result;
    }

    function resetDemo() {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        view: { view: "landing" },
        agents: seedAgents,
        explorerFeed: [],
        activeVerification: null,
      });
    }

    return {
      ...state,
      navigate,
      createAgent,
      runVerification,
      selectAgent,
      resetDemo,
    };
  }, [state]);

  return <KyaContext.Provider value={runtime}>{children}</KyaContext.Provider>;
}

export function useKyaRuntime() {
  const ctx = useContext(KyaContext);
  if (!ctx) throw new Error("useKyaRuntime must be used inside KyaRuntimeProvider");
  return ctx;
}
