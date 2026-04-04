import { FaArrowRight, FaBan, FaCheckCircle, FaRobot, FaShieldAlt } from "react-icons/fa";

interface LandingProps {
  onNavigate: (page: string) => void;
}

const stats = [
  { value: "142", label: "Agents registered", icon: FaRobot },
  { value: "8,421", label: "Verifications", icon: FaShieldAlt },
  { value: "312", label: "Rejected transactions", icon: FaBan },
];

const steps = [
  { title: "Register agent", description: "Create a profile, set limits, and mint a credential NFT." },
  { title: "Verify intent", description: "Every transaction is checked before execution." },
  { title: "Record result", description: "Approval and rejection decisions are saved on-chain." },
];

export default function Landing({ onNavigate }: LandingProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="text-2xl font-medium text-emerald-900">Know Your Agent</h1>
      <p className="mt-2 max-w-2xl text-sm text-gray-600">
        AI verification for every agent action with transparent history and reputation.
      </p>

      <div className="mt-4 flex gap-2 text-sm">
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-emerald-700 px-3 py-1.5 text-white transition-colors duration-150 hover:bg-emerald-600"
          onClick={() => onNavigate("register")}
        >
          <FaCheckCircle className="text-xs" />
          Register agent
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded px-3 py-1.5 text-emerald-700 transition-colors duration-150 hover:bg-emerald-100"
          onClick={() => onNavigate("explorer")}
        >
          Check agent
          <FaArrowRight className="text-xs" />
        </button>
      </div>

      <ul className="mt-8 grid gap-4 text-sm sm:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label}>
              <p className="flex items-center gap-2 text-xl text-gray-900">
                <Icon className="text-sm text-emerald-600" />
                {item.value}
              </p>
              <p className="text-gray-600">{item.label}</p>
            </li>
          );
        })}
      </ul>

      <h2 className="mt-8 text-sm text-gray-500">How it works</h2>
      <ol className="mt-2 space-y-3 text-sm">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="w-4 text-emerald-600">{index + 1}</span>
            <div>
              <p className="text-gray-900">{step.title}</p>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  );
}
