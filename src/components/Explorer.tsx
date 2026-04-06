import { useState } from "react";
import { FaArrowRight, FaChevronDown, FaChevronUp, FaSearch } from "react-icons/fa";

interface ExplorerProps {
  onNavigate: (page: string) => void;
}

type FeedItem = {
  id: string;
  agentId: string;
  amount: string;
  address: string;
  time: string;
  verdict: "approve" | "reject";
  rationale: string;
};

const feedItems: FeedItem[] = [
  {
    id: "f-1",
    agentId: "agt_8f2k",
    amount: "0.1 SOL",
    address: "GpuS...rv1c",
    time: "2 min ago",
    verdict: "approve",
    rationale: "Known vendor, recurring billing pattern.",
  },
  {
    id: "f-2",
    agentId: "agt_3m2p",
    amount: "50 SOL",
    address: "3x7M...unkn",
    time: "18 min ago",
    verdict: "reject",
    rationale: "Amount spike and unknown destination.",
  },
  {
    id: "f-3",
    agentId: "agt_7x9k",
    amount: "0.5 SOL",
    address: "Dex1...sw4p",
    time: "45 min ago",
    verdict: "approve",
    rationale: "DEX route is in strategy whitelist.",
  },
  {
    id: "f-4",
    agentId: "agt_4nR1",
    amount: "25 SOL",
    address: "8mNp...2kQ9",
    time: "1 hour ago",
    verdict: "reject",
    rationale: "Exceeded per-transaction policy cap.",
  },
  {
    id: "f-5",
    agentId: "agt_9pL5",
    amount: "0.05 SOL",
    address: "Api3...svc1",
    time: "2 hours ago",
    verdict: "approve",
    rationale: "Micro-payment falls inside budget window.",
  },
  {
    id: "f-6",
    agentId: "agt_2kJ8",
    amount: "1.2 SOL",
    address: "Nft2...mkt7",
    time: "3 hours ago",
    verdict: "approve",
    rationale: "Destination tied to verified marketplace cluster.",
  },
  {
    id: "f-7",
    agentId: "agt_6wX3",
    amount: "15 SOL",
    address: "5rTp...new0",
    time: "4 hours ago",
    verdict: "reject",
    rationale: "New program interaction outside allowlist.",
  },
  {
    id: "f-8",
    agentId: "agt_1bQ7",
    amount: "0.3 SOL",
    address: "Pay1...sub9",
    time: "5 hours ago",
    verdict: "approve",
    rationale: "Subscription flow recognized and confirmed.",
  },
];

export default function Explorer({ onNavigate }: ExplorerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-12">
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-[#16241d]">Explorer</h2>
          <p className="mt-2 text-sm text-[#4f6359]">
            Investigate recent verifications and inspect why intents were approved or blocked.
          </p>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#d2ddd7] bg-[#f8fbf9] px-3 py-2.5">
            <FaSearch className="text-xs text-emerald-600" />
            <input
              className="w-full bg-transparent text-sm text-[#1c2b24] outline-none"
              placeholder="Search by agent ID or wallet address"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-12">
          <h3 className="text-lg font-semibold text-[#1a2b23]">Recent Verifications</h3>
          <p className="mt-1 text-xs text-[#5f7369]">Click a record to reveal rationale.</p>

          <div className="mt-4 space-y-2">
            {feedItems.map((item) => {
              const expanded = item.id === expandedId;
              const verdictTone =
                item.verdict === "approve"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-800";

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#dbe4df] bg-[#f9fcfa] px-4 py-3 transition-all duration-200 hover:border-[#bdd0c6]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <button
                      type="button"
                      className="flex-1 text-left"
                      onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#1f3028]">{item.agentId}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.13em] ${verdictTone}`}>
                          {item.verdict}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#4c6257]">
                        <span className="font-mono text-[#1f3028]">{item.amount}</span>
                        <span>-&gt; {item.address}</span>
                        <FaArrowRight className="text-[10px] text-emerald-600" />
                      </p>
                    </button>

                    <div className="flex items-center gap-2 text-xs text-[#5f7369]">
                      <span>{item.time}</span>
                      {expanded ? <FaChevronUp /> : <FaChevronDown />}
                      <button
                        type="button"
                        className="rounded-lg border border-[#d0dcd5] bg-white px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#40564a] hover:border-[#b7c8be]"
                        onClick={() => onNavigate("agent")}
                      >
                        open
                      </button>
                    </div>
                  </div>

                  {expanded ? (
                    <div className="mt-3 rounded-xl border border-[#d7e2dc] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#5f7369]">Rationale</p>
                      <p className="mt-1 text-sm text-[#30433a]">{item.rationale}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
