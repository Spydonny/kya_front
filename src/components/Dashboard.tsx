import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { formatWalletAddress } from "../utils/formatWalletAddress";
import type { AgentRecord } from "./dashboard/types";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const agents: AgentRecord[] = [
  {
    id: "trading-alpha",
    name: "Trading Bot Alpha",
    status: "trusted",
    trust: 82,
    verifications24h: 142,
    rejected24h: 7,
    intentCoverage: 88,
    reasonSummary: "Stable behavioral profile with low drift and strong policy alignment.",
    reasoningLog: [
      "Signer history unchanged across 142 verifications in 24h",
      "Transaction intents within approved trading boundaries",
      "No privilege escalation in instruction sets",
    ],
  },
  {
    id: "payment-processor",
    name: "Payment Processor",
    status: "trusted",
    trust: 95,
    verifications24h: 431,
    rejected24h: 2,
    intentCoverage: 96,
    reasonSummary: "High-consistency execution path, near-zero anomaly variance.",
    reasoningLog: [
      "Recipient graph mapped to approved enterprise wallets",
      "Nonce and fee patterns match historical baseline",
      "Only 2 rejections, both due to user-defined daily cap",
    ],
  },
  {
    id: "defi-arbitrage",
    name: "DeFi Arbitrage Bot",
    status: "risky",
    trust: 56,
    verifications24h: 38,
    rejected24h: 15,
    intentCoverage: 61,
    reasonSummary: "Higher variance detected in destination pools and instruction timing.",
    reasoningLog: [
      "Observed new destination programs not seen in prior windows",
      "Execution burst frequency exceeded policy baseline",
      "15 rejected intents due to unknown router combinations",
    ],
  },
  {
    id: "research-oracle",
    name: "Research Oracle",
    status: "unknown",
    trust: 68,
    verifications24h: 67,
    rejected24h: 6,
    intentCoverage: 72,
    reasonSummary: "Credential NFT verified, but insufficient historical intent depth.",
    reasoningLog: [
      "Identity and credential chain is valid on Solana",
      "Model behavior appears stable over 7-day sample only",
      "Needs 30-day history for trusted classification",
    ],
  },
  {
    id: "ops-guardian",
    name: "Ops Guardian",
    status: "trusted",
    trust: 90,
    verifications24h: 204,
    rejected24h: 4,
    intentCoverage: 93,
    reasonSummary: "Strong protection patterns with deterministic decision flow.",
    reasoningLog: [
      "Consistent rule application on all treasury intents",
      "Low false-positive rejection rate across protected wallets",
      "Mature profile with high confidence pathing",
    ],
  },
];

const timeline = [
  {
    title: "Intent Parsed",
    time: "08:42:11",
    text: "Swap SOL to USDC from treasury wallet with slippage cap.",
  },
  {
    title: "Policy Match",
    time: "08:42:12",
    text: "Matched low-risk profile and whitelist destination set.",
  },
  {
    title: "Simulation",
    time: "08:42:12",
    text: "Pre-flight simulation passed with no privileged mismatch.",
  },
  {
    title: "Execution Gate",
    time: "08:42:13",
    text: "Approved by verifier quorum and forwarded on-chain.",
  },
];

const nodePositions = [
  { left: "14%", top: "22%" },
  { left: "40%", top: "16%" },
  { left: "72%", top: "28%" },
  { left: "24%", top: "68%" },
  { left: "80%", top: "70%" },
];

const statusStyles: Record<AgentRecord["status"], { label: string; badge: string; dot: string }> = {
  trusted: {
    label: "Trusted",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
  },
  risky: {
    label: "Risky",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
  },
  unknown: {
    label: "Unknown",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
  },
};

function trustNodeColor(trust: number) {
  if (trust >= 85) return "bg-emerald-500 ring-emerald-200";
  if (trust >= 65) return "bg-emerald-400 ring-emerald-100";
  return "bg-amber-500 ring-amber-200";
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { publicKey } = useWallet();
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0].id);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const ownerAddress = formatWalletAddress(publicKey?.toBase58());

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0],
    [selectedAgentId],
  );

  const totals = useMemo(
    () =>
      agents.reduce(
        (result, agent) => {
          result.verified += agent.verifications24h;
          result.rejected += agent.rejected24h;
          return result;
        },
        { verified: 0, rejected: 0 },
      ),
    [],
  );

  const totalChecks = totals.verified + totals.rejected;
  const passRatio = totalChecks > 0 ? Math.round((totals.verified / totalChecks) * 1000) / 10 : 0;

  if (!publicKey) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-4 lg:grid-cols-12">
          <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">Access Required</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#16241d]">
              Agent Verification Console
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#4f6359]">
              Connect a Solana wallet to open your KYA modules, inspect intent decisions, and manage
              credential NFTs.
            </p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#173528] px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-[#1e4433]"
              onClick={() => onNavigate("landing")}
            >
              Back to home
              <FaArrowRight className="text-xs" />
            </button>
          </section>

          <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">What Unlocks</p>
            <ul className="mt-3 space-y-2 text-sm text-[#4f6359]">
              <li>Owner-scoped agent control modules</li>
              <li>Reasoning logs per transaction intent</li>
              <li>Trust graph and risk telemetry</li>
            </ul>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">Control Surface</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#16241d]">KYA Operations Grid</h2>
              <p className="mt-1 text-xs text-[#5d7267]">Owner wallet: {ownerAddress}</p>
            </div>
            <div className="rounded-xl border border-[#d4dfd9] bg-[#f7faf8] px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#607469]">Focused Agent</p>
              <p className="mt-1 text-sm font-medium text-[#1f3128]">{selectedAgent.name}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">Credential NFT</p>
          <div className="mt-3 rounded-xl border border-[#d6e2db] bg-[#f8fbf9] p-3">
            <p className="text-[11px] uppercase tracking-[0.13em] text-[#5f7469]">Credential State</p>
            <p className="mt-1 font-mono text-sm text-[#1e2f27]">Verified / Revocation-safe</p>
          </div>
          <button
            type="button"
            className="mt-3 text-xs uppercase tracking-[0.12em] text-[#29473a] transition-colors duration-150 hover:text-[#183126]"
            onClick={() => onNavigate("agent")}
          >
            Open credential detail
          </button>
        </section>

        <section className="grid gap-3 lg:col-span-4">
          <article className="rounded-2xl border border-[#d9e3de] bg-white/90 p-4 shadow-[0_6px_18px_rgba(47,74,60,0.06)]">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#607469]">Active Agents</p>
              <HiOutlineCheckBadge className="text-[#2d4f40]" />
            </div>
            <p className="mt-2 font-mono text-2xl text-[#13221b]">{agents.length}</p>
            <p className="mt-1 text-xs text-[#5f7369]">Modules currently monitored by KYA.</p>
          </article>

          <article className="rounded-2xl border border-[#d9e3de] bg-white/90 p-4 shadow-[0_6px_18px_rgba(47,74,60,0.06)]">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#607469]">Verified Intents</p>
              <FaShieldAlt className="text-[#2d4f40]" />
            </div>
            <p className="mt-2 font-mono text-2xl text-[#13221b]">{totals.verified}</p>
            <p className="mt-1 text-xs text-[#5f7369]">Pass ratio: {passRatio}%</p>
          </article>

          <article className="rounded-2xl border border-[#d9e3de] bg-white/90 p-4 shadow-[0_6px_18px_rgba(47,74,60,0.06)]">
            <div className="flex items-start justify-between">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#607469]">Rejected Intents</p>
              <FaTimesCircle className="text-[#8b5d28]" />
            </div>
            <p className="mt-2 font-mono text-2xl text-[#13221b]">{totals.rejected}</p>
            <p className="mt-1 text-xs text-[#5f7369]">Containment stable</p>
          </article>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">Signature Element</p>
              <h3 className="mt-1 text-lg font-semibold text-[#1a2b23]">Trust Graph</h3>
              <p className="mt-1 text-xs text-[#5f7369]">Node size = verification load, color = trust band.</p>
            </div>
            <p className="font-mono text-xs text-[#5f7369]">Mesh / 24h</p>
          </div>

          <div className="relative mt-4 h-60 overflow-hidden rounded-2xl border border-[#d9e3de] bg-[#f8fbf9]">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background:linear-gradient(to_right,#dbe5df_1px,transparent_1px),linear-gradient(to_bottom,#dbe5df_1px,transparent_1px)] [background-size:24px_24px]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
              <line x1="16" y1="24" x2="40" y2="16" stroke="#b9c9c0" strokeWidth="0.5" />
              <line x1="40" y1="16" x2="72" y2="28" stroke="#b9c9c0" strokeWidth="0.5" />
              <line x1="72" y1="28" x2="80" y2="70" stroke="#b9c9c0" strokeWidth="0.5" />
              <line x1="40" y1="16" x2="24" y2="68" stroke="#b9c9c0" strokeWidth="0.5" />
              <line x1="24" y1="68" x2="80" y2="70" stroke="#b9c9c0" strokeWidth="0.5" />
            </svg>

            {agents.map((agent, index) => {
              const position = nodePositions[index];
              const active = agent.id === selectedAgentId;
              const size = Math.max(22, Math.min(34, Math.round(agent.verifications24h / 15)));

              return (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => setSelectedAgentId(agent.id)}
                  style={{ left: position.left, top: position.top, width: `${size}px`, height: `${size}px` }}
                  className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 transition-all duration-200 ${trustNodeColor(
                    agent.trust,
                  )} ${active ? "scale-110" : "hover:scale-105"}`}
                >
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-[#d1ddd6] bg-white px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#395448] group-hover:block">
                    {agent.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3 lg:col-span-7">
          {agents.map((agent) => {
            const selected = agent.id === selectedAgentId;
            const expanded = agent.id === expandedAgentId;
            const status = statusStyles[agent.status];

            return (
              <article
                key={agent.id}
                className={`rounded-2xl border bg-white/90 p-4 shadow-[0_6px_18px_rgba(47,74,60,0.06)] transition-colors duration-150 ${
                  selected ? "border-emerald-300" : "border-[#d8e2dd]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#607469]">Agent Module</p>
                    <h4 className="mt-1 text-base font-semibold text-[#1f3128]">{agent.name}</h4>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${status.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border border-[#dde6e1] bg-[#f7faf8] p-2">
                    <p className="uppercase tracking-[0.1em] text-[#607469]">Trust</p>
                    <p className="mt-1 font-mono text-[#17261f]">{agent.trust}%</p>
                  </div>
                  <div className="rounded-lg border border-[#dde6e1] bg-[#f7faf8] p-2">
                    <p className="uppercase tracking-[0.1em] text-[#607469]">Verified</p>
                    <p className="mt-1 font-mono text-[#17261f]">{agent.verifications24h}</p>
                  </div>
                  <div className="rounded-lg border border-[#dde6e1] bg-[#f7faf8] p-2">
                    <p className="uppercase tracking-[0.1em] text-[#607469]">Rejected</p>
                    <p className="mt-1 font-mono text-[#17261f]">{agent.rejected24h}</p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[#4f6359]">{agent.reasonSummary}</p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-[#d7e3dc]">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${agent.intentCoverage}%` }}
                    />
                  </div>
                  <p className="font-mono text-[11px] text-[#5f7369]">{agent.intentCoverage}% intent coverage</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      onNavigate("agent");
                    }}
                    className="text-xs uppercase tracking-[0.12em] text-[#28473a] transition-colors duration-150 hover:text-[#173126]"
                  >
                    Open agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedAgentId((prev) => (prev === agent.id ? null : agent.id))}
                    className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-[#5f7369] transition-colors duration-150 hover:text-[#385245]"
                  >
                    {expanded ? "Hide reasoning" : "Show reasoning"}
                    {expanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                  </button>
                </div>

                {expanded ? (
                  <div className="mt-3 rounded-xl border border-[#dbe5df] bg-[#f8fbf9] p-3">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#607469]">Decision Log</p>
                    <ul className="mt-2 space-y-1.5">
                      {agent.reasoningLog.map((entry) => (
                        <li key={entry} className="text-sm text-[#42564c]">
                          {entry}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-5">
          <h3 className="text-lg font-semibold text-[#1a2b23]">Intent Timeline</h3>
          <p className="mt-1 text-xs text-[#5f7369]">Verification flow for the latest approved intent.</p>

          <ol className="mt-4 space-y-2">
            {timeline.map((item, index) => (
              <li key={item.title} className="rounded-xl border border-[#dbe5df] bg-[#f9fcfa] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 font-mono text-[11px] text-emerald-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[#203229]">{item.title}</p>
                      <p className="text-xs text-[#4f6359]">{item.text}</p>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-[#5f7369]">{item.time}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p className="inline-flex items-center gap-2">
              <FaCheckCircle className="text-xs" />
              Last intent passed with deterministic policy match.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
