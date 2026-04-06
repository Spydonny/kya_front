import { useState } from "react";
import { FaBolt, FaCheckCircle, FaFlask, FaMagic, FaTimesCircle } from "react-icons/fa";

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
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-7">
          <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-[-0.02em] text-[#16241d]">
            <FaFlask className="text-lg text-emerald-600" />
            Live Verification Lab
          </h2>
          <p className="mt-2 text-sm text-[#4f6359]">
            Run transaction intent simulations and inspect how trust score changes in real time.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block text-sm text-[#30443a]">
              Action type
              <select
                className="mt-1.5 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                value={actionType}
                onChange={(event) => setActionType(event.target.value)}
              >
                <option value="transfer">Transfer</option>
                <option value="pay">Pay</option>
                <option value="swap">Swap</option>
              </select>
            </label>

            <label className="block text-sm text-[#30443a]">
              Amount (SOL)
              <input
                className="mt-1.5 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                type="number"
                placeholder="0.1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <label className="block text-sm text-[#30443a]">
              Recipient address
              <input
                className="mt-1.5 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="7xK9...3fB2"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </label>

            <label className="block text-sm text-[#30443a]">
              Context
              <textarea
                className="mt-1.5 min-h-28 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="Why is this transaction needed?"
                value={context}
                onChange={(event) => setContext(event.target.value)}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-[#173528] px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-[#1e4433]"
                onClick={handleVerify}
              >
                <FaBolt className="text-xs" />
                Send for verification
              </button>

              <button
                type="button"
                className="text-sm text-[#4f655b] transition-colors duration-150 hover:text-[#1d3328]"
                onClick={fillSuspicious}
              >
                Suspicious preset
              </button>

              <button
                type="button"
                className="text-sm text-[#4f655b] transition-colors duration-150 hover:text-[#1d3328]"
                onClick={fillLegit}
              >
                Legit preset
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/85 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1a2b23]">Verification Output</h3>
            <span className="rounded-full border border-[#d1ddd6] bg-[#f7faf8] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#577064]">
              Simulated
            </span>
          </div>

          {!loading && !result ? (
            <p className="mt-4 text-sm text-[#5a7065]">Submit a transaction intent to see policy reasoning.</p>
          ) : null}

          {loading ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p className="inline-flex items-center gap-2">
                <FaMagic className="text-xs" />
                Analyzing transaction and matching policy constraints...
              </p>
            </div>
          ) : null}

          {result ? (
            <div className="mt-4 space-y-3 rounded-2xl border border-[#d8e3dd] bg-[#f9fcfa] p-4 text-sm">
              <p className="flex items-center gap-2 font-medium text-[#1e2d26]">
                {result.verdict === "approve" ? (
                  <FaCheckCircle className="text-sm text-emerald-600" />
                ) : (
                  <FaTimesCircle className="text-sm text-amber-500" />
                )}
                {result.verdict.toUpperCase()}
              </p>
              <p className="text-[#4b6156]">{result.explanation}</p>
              <dl className="space-y-2 text-[#4a6156]">
                <div className="flex justify-between gap-3">
                  <dt>On-chain</dt>
                  <dd className="font-medium text-[#1d2c25]">Recorded</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>TX hash</dt>
                  <dd className="font-mono text-[#1d2c25]">{result.txHash}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>NFT update</dt>
                  <dd className={result.trustDelta > 0 ? "text-emerald-700" : "text-amber-700"}>
                    {result.trustDelta > 0 ? `Trust +${result.trustDelta}` : `Trust ${result.trustDelta}`}
                  </dd>
                </div>
              </dl>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
