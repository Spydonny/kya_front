import { FaArrowRight, FaSearch } from "react-icons/fa";

interface ExplorerProps {
  onNavigate: (page: string) => void;
}

const feedItems = [
  { agentId: "agt_8f2k", amount: "0.1 SOL", address: "GpuS...rv1c", time: "2 min ago", verdict: "approve" as const },
  { agentId: "agt_3m2p", amount: "50 SOL", address: "3x7M...unkn", time: "18 min ago", verdict: "reject" as const },
  { agentId: "agt_7x9k", amount: "0.5 SOL", address: "Dex1...sw4p", time: "45 min ago", verdict: "approve" as const },
  { agentId: "agt_4nR1", amount: "25 SOL", address: "8mNp...2kQ9", time: "1 hour ago", verdict: "reject" as const },
  { agentId: "agt_9pL5", amount: "0.05 SOL", address: "Api3...svc1", time: "2 hours ago", verdict: "approve" as const },
  { agentId: "agt_2kJ8", amount: "1.2 SOL", address: "Nft2...mkt7", time: "3 hours ago", verdict: "approve" as const },
  { agentId: "agt_6wX3", amount: "15 SOL", address: "5rTp...new0", time: "4 hours ago", verdict: "reject" as const },
  { agentId: "agt_1bQ7", amount: "0.3 SOL", address: "Pay1...sub9", time: "5 hours ago", verdict: "approve" as const },
];

export default function Explorer({ onNavigate }: ExplorerProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="text-2xl font-medium text-emerald-900">Explorer</h2>

      <div className="mt-4 flex items-center gap-2 rounded border border-emerald-200 bg-white px-3 py-2">
        <FaSearch className="text-xs text-emerald-600" />
        <input className="w-full text-sm outline-none" placeholder="Search by agent ID or wallet address" />
      </div>

      <h3 className="mt-6 text-sm text-gray-600">Recent verifications</h3>
      <div className="mt-2 divide-y divide-emerald-100">
        {feedItems.map((item) => (
          <button
            key={`${item.agentId}-${item.time}`}
            type="button"
            className="w-full py-3 text-left transition-colors duration-150 hover:bg-emerald-50"
            onClick={() => onNavigate("agent")}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm text-gray-700">{item.agentId}</span>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-600">
              {item.amount} -&gt; {item.address} · {item.verdict}
              <FaArrowRight className="text-xs text-emerald-500" />
            </p>
          </button>
        ))}
      </div>
    </main>
  );
}
