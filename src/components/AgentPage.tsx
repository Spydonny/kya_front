import { useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaHistory,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";

type HistoryItem = {
  id: string;
  type: "approve" | "reject";
  amount: string;
  address: string;
  reason: string;
  time: string;
  details: string;
};

const historyItems: HistoryItem[] = [
  {
    id: "h-1",
    type: "approve",
    amount: "0.1 SOL",
    address: "9pK2...mF4a",
    reason:
      "Standard payment to a known GPU compute provider. Amount is within normal range and address has prior history.",
    time: "2 min ago",
    details: "Policy A-12 matched. Destination scored 0.97 legitimacy based on 30-day flow history.",
  },
  {
    id: "h-2",
    type: "reject",
    amount: "50 SOL",
    address: "3x7M...unknown",
    reason: "Large transfer to a new address without context. Flagged as suspicious and escalated to owner.",
    time: "18 min ago",
    details: "Failed checks: unknown destination + amount spike (5.8x). Manual review required.",
  },
  {
    id: "h-3",
    type: "approve",
    amount: "0.5 SOL",
    address: "Dex1...sw4p",
    reason: "Token swap on verified DEX. Amount and destination match configured strategy.",
    time: "1 hour ago",
    details: "Router instruction set matched known template. Slippage guard remained under 0.6%.",
  },
  {
    id: "h-4",
    type: "reject",
    amount: "25 SOL",
    address: "8mNp...2kQ9",
    reason: "Transfer exceeds max transaction limit of 10 SOL.",
    time: "3 hours ago",
    details: "Policy B-07 threshold exceeded. Auto-stop applied before signing.",
  },
  {
    id: "h-5",
    type: "approve",
    amount: "0.05 SOL",
    address: "Api3...svc1",
    reason: "Recurring micro-payment for API service subscription.",
    time: "5 hours ago",
    details: "Repeated pattern recognized. Budget window and cadence both valid.",
  },
];

export default function AgentPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5f7469]">Agent Profile</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#14211b]">Trading Bot Alpha</h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4d6258]">
            Credential-bound execution agent with verified intent screening before every transaction.
          </p>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#dde6e1] bg-[#f7faf8] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#607469]">Trust level</dt>
              <dd className="mt-1 font-mono text-lg text-[#12221b]">82 / 100</dd>
            </div>
            <div className="rounded-2xl border border-[#dde6e1] bg-[#f7faf8] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#607469]">Verifications</dt>
              <dd className="mt-1 font-mono text-lg text-[#12221b]">142</dd>
            </div>
            <div className="rounded-2xl border border-[#dde6e1] bg-[#f7faf8] px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-[#607469]">Rejections</dt>
              <dd className="mt-1 font-mono text-lg text-[#12221b]">7</dd>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <dt className="text-[11px] uppercase tracking-[0.14em] text-emerald-700">Status</dt>
              <dd className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-emerald-800">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-4">
          <div className="flex items-center gap-2 text-[#1b2b23]">
            <FaShieldAlt className="text-sm text-emerald-600" />
            <p className="text-sm font-medium uppercase tracking-[0.16em]">Credential NFT</p>
          </div>
          <p className="mt-3 text-sm text-[#4c6157]">Minted and bound to owner wallet. Revocation status clean.</p>
          <div className="mt-4 rounded-2xl border border-[#dbe5df] bg-[#f8fbf9] p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-[#607469]">Contract</p>
            <p className="mt-1 font-mono text-sm text-[#1c2b24]">KYA-CRD / Devnet</p>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-12">
          <h3 className="flex items-center gap-2 text-lg font-medium text-[#1a2b23]">
            <FaHistory className="text-sm text-emerald-600" />
            Decision History
          </h3>
          <p className="mt-1 text-xs text-[#5e7368]">Click any event to view reasoning details.</p>

          <div className="mt-4 space-y-2">
            {historyItems.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#dbe4df] bg-[#f9fcfa] px-4 py-3 transition-all duration-200 hover:border-[#bdd0c6]"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 text-sm text-[#1d2c25]">
                          {item.type === "approve" ? (
                            <FaCheckCircle className="text-xs text-emerald-600" />
                          ) : (
                            <FaTimesCircle className="text-xs text-amber-500" />
                          )}
                          <span className="font-semibold uppercase tracking-[0.08em]">{item.type}</span>
                          <span className="font-mono">{item.amount}</span>
                          <span className="text-[#62766c]">-&gt; {item.address}</span>
                        </p>
                        <p className="mt-1 text-sm text-[#4f645a]">{item.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap text-xs text-[#5f7369]">{item.time}</span>
                        {expanded ? (
                          <FaChevronUp className="text-xs text-[#5f7369]" />
                        ) : (
                          <FaChevronDown className="text-xs text-[#5f7369]" />
                        )}
                      </div>
                    </div>
                  </button>

                  {expanded ? (
                    <div className="mt-3 rounded-xl border border-[#d7e2dc] bg-white px-3 py-2">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#5f7369]">Reasoning Log</p>
                      <p className="mt-1 text-sm text-[#30433a]">{item.details}</p>
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
