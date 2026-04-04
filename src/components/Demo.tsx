import { useState } from "react";
import { FaBolt, FaCheckCircle, FaFlask, FaTimesCircle } from "react-icons/fa";

type DemoResult = {
  verdict: "approve" | "reject";
  explanation: string;
  txHash: string;
  trustDelta: number;
} | null;

export default function Demo() {
  const [actionType, setActionType] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DemoResult>(null);

  const fillSuspicious = () => {
    setActionType("transfer");
    setAmount("50");
    setAddress("3x7M...unknown");
    setContext("");
    setResult(null);
  };

  const fillLegit = () => {
    setActionType("pay");
    setAmount("0.1");
    setAddress("GpuS...rv1c");
    setContext("Monthly GPU compute subscription payment");
    setResult(null);
  };

  const handleVerify = () => {
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      const isSuspicious = Number(amount) > 10;

      setResult({
        verdict: isSuspicious ? "reject" : "approve",
        explanation: isSuspicious
          ? "Large transfer to an unknown address with no context. Amount exceeds normal operating range."
          : "Payment to a known provider. Amount is within limits and consistent with prior activity.",
        txHash: isSuspicious ? "4xK9...rEj7" : "7mAp...pRv3",
        trustDelta: isSuspicious ? -3 : 1,
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="flex items-center gap-2 text-2xl font-medium text-emerald-900">
        <FaFlask className="text-base text-emerald-600" />
        Live demo
      </h2>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <section>
          <h3 className="text-sm text-gray-600">Agent simulator</h3>

          <div className="mt-3 space-y-3">
            <label className="block text-sm text-gray-700">
              Action type
              <select
                className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
                value={actionType}
                onChange={(event) => setActionType(event.target.value)}
              >
                <option value="transfer">Transfer</option>
                <option value="pay">Pay</option>
                <option value="swap">Swap</option>
              </select>
            </label>

            <label className="block text-sm text-gray-700">
              Amount (SOL)
              <input
                className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
                type="number"
                placeholder="0.1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <label className="block text-sm text-gray-700">
              Recipient address
              <input
                className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="7xK9...3fB2"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>

            <label className="block text-sm text-gray-700">
              Context
              <textarea
                className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="Why is this transaction needed?"
                value={context}
                onChange={(event) => setContext(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="flex items-center gap-2 rounded bg-emerald-700 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-emerald-600"
              onClick={handleVerify}
            >
              <FaBolt className="text-xs" />
              Send for verification
            </button>

            <div className="flex flex-wrap gap-3 text-sm">
              <button
                type="button"
                className="text-gray-600 transition-colors duration-150 hover:text-emerald-700"
                onClick={fillSuspicious}
              >
                Suspicious: 50 SOL to unknown
              </button>
              <button
                type="button"
                className="text-gray-600 transition-colors duration-150 hover:text-emerald-700"
                onClick={fillLegit}
              >
                Legit: 0.1 SOL for GPU
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm text-gray-600">Verification result</h3>

          {!loading && !result && <p className="mt-3 text-sm text-gray-600">Submit a transaction to see analysis.</p>}

          {loading && <p className="mt-3 text-sm text-emerald-700">Analyzing transaction...</p>}

          {result && (
            <div className="mt-3 space-y-3 text-sm">
              <p className="flex items-center gap-1.5 text-gray-900">
                {result.verdict === "approve" ? (
                  <FaCheckCircle className="text-xs text-emerald-600" />
                ) : (
                  <FaTimesCircle className="text-xs text-emerald-400" />
                )}
                {result.verdict.toUpperCase()}
              </p>
              <p className="text-gray-600">{result.explanation}</p>
              <dl className="space-y-1 text-gray-600">
                <div className="flex gap-2">
                  <dt>On-chain:</dt>
                  <dd>Recorded</dd>
                </div>
                <div className="flex gap-2">
                  <dt>TX hash:</dt>
                  <dd className="font-mono text-gray-700">{result.txHash}</dd>
                </div>
                <div className="flex gap-2">
                  <dt>NFT update:</dt>
                  <dd className={result.trustDelta > 0 ? "text-emerald-700" : "text-emerald-500"}>
                    {result.trustDelta > 0 ? `Trust +${result.trustDelta}` : `Trust ${result.trustDelta}`}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
