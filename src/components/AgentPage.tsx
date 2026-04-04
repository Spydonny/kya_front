import { FaCheckCircle, FaHistory, FaTimesCircle } from "react-icons/fa";

const historyItems = [
  {
    type: "approve" as const,
    amount: "0.1 SOL",
    address: "9pK2...mF4a",
    reason:
      "Standard payment to a known GPU compute provider. Amount is within normal range and address has prior history.",
    time: "2 min ago",
  },
  {
    type: "reject" as const,
    amount: "50 SOL",
    address: "3x7M...unknown",
    reason:
      "Large transfer to a new address without context. Flagged as suspicious and escalated to owner.",
    time: "18 min ago",
  },
  {
    type: "approve" as const,
    amount: "0.5 SOL",
    address: "Dex1...sw4p",
    reason: "Token swap on verified DEX. Amount and destination match configured strategy.",
    time: "1 hour ago",
  },
  {
    type: "reject" as const,
    amount: "25 SOL",
    address: "8mNp...2kQ9",
    reason: "Transfer exceeds max transaction limit of 10 SOL.",
    time: "3 hours ago",
  },
  {
    type: "approve" as const,
    amount: "0.05 SOL",
    address: "Api3...svc1",
    reason: "Recurring micro-payment for API service subscription.",
    time: "5 hours ago",
  },
];

export default function AgentPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <section>
        <h2 className="text-xl font-medium text-emerald-900">Trading Bot Alpha</h2>
        <p className="mt-1 text-sm text-gray-600">Credential NFT</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-gray-500">Trust level</dt>
            <dd>82 / 100</dd>
          </div>
          <div>
            <dt className="text-gray-500">Verifications</dt>
            <dd>142</dd>
          </div>
          <div>
            <dt className="text-gray-500">Rejections</dt>
            <dd>7</dd>
          </div>
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="text-emerald-700">Active</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h3 className="flex items-center gap-2 text-base text-gray-900">
          <FaHistory className="text-xs text-emerald-600" />
          Decision history
        </h3>
        <div className="mt-2 divide-y divide-emerald-100">
          {historyItems.map((item) => (
            <article key={`${item.time}-${item.address}`} className="py-3">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-1.5 text-sm text-gray-900">
                  {item.type === "approve" ? (
                    <FaCheckCircle className="text-xs text-emerald-600" />
                  ) : (
                    <FaTimesCircle className="text-xs text-emerald-400" />
                  )}
                  {item.type.toUpperCase()} {item.amount} -&gt; {item.address}
                </p>
                <span className="text-xs text-gray-500">{item.time}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{item.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
