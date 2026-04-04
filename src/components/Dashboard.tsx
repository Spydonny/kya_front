import { useWallet } from "@solana/wallet-adapter-react";
import { FaExternalLinkAlt, FaRobot } from "react-icons/fa";
import { formatWalletAddress } from "../utils/formatWalletAddress";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const agents = [
  {
    name: "Trading Bot Alpha",
    trust: 82,
    verifications: 142,
    rejections: 7,
  },
  {
    name: "Payment Processor",
    trust: 95,
    verifications: 431,
    rejections: 2,
  },
  {
    name: "DeFi Arbitrage Bot",
    trust: 56,
    verifications: 38,
    rejections: 15,
  },
];

function trustColor(trust: number) {
  if (trust >= 80) return "bg-emerald-600";
  if (trust >= 60) return "bg-emerald-500";
  return "bg-emerald-300";
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { publicKey } = useWallet();
  const ownerAddress = formatWalletAddress(publicKey?.toBase58());

  if (!publicKey) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-medium text-emerald-900">My agents</h2>
          <p className="mt-2 max-w-xl text-sm text-gray-600">
            Connect a Solana wallet to load agents owned by your address and manage their credentials.
          </p>
          <button
            type="button"
            className="mt-4 rounded bg-emerald-700 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-emerald-600"
            onClick={() => onNavigate("landing")}
          >
            Back to home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="text-2xl font-medium text-emerald-900">My agents</h2>
      <p className="mt-2 text-sm text-gray-600">Connected owner wallet: {ownerAddress}</p>

      <ul className="mt-4 divide-y divide-emerald-100">
        {agents.map((agent) => (
          <li key={agent.name} className="py-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="flex items-center gap-2 text-base text-gray-900">
                <FaRobot className="text-xs text-emerald-600" />
                {agent.name}
              </h3>
              <span className="text-xs text-emerald-700">active</span>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Trust</span>
                <span>{agent.trust}/100</span>
              </div>
              <div className="mt-1 h-1 rounded bg-emerald-100">
                <div
                  className={`h-full rounded ${trustColor(agent.trust)} transition-all duration-200`}
                  style={{ width: `${agent.trust}%` }}
                />
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              {agent.verifications} verifications · {agent.rejections} rejected · {ownerAddress}
            </p>

            <div className="mt-2 flex gap-3 text-sm">
              <button
                type="button"
                className="text-emerald-700 transition-colors duration-150 hover:text-emerald-600"
                onClick={() => onNavigate("agent")}
              >
                Open agent
              </button>
              <button
                type="button"
                className="flex items-center gap-1.5 text-gray-500 transition-colors duration-150 hover:text-emerald-700"
              >
                View NFT
                <FaExternalLinkAlt className="text-xs" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 text-sm text-emerald-700 transition-colors duration-150 hover:text-emerald-600"
        onClick={() => onNavigate("register")}
      >
        Register new agent
      </button>
    </main>
  );
}
