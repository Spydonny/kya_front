import { useState, type FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaCheckCircle, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import { formatWalletAddress } from "../utils/formatWalletAddress";

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [maxTx, setMaxTx] = useState("");
  const { connected, publicKey } = useWallet();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!connected || !name.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-8">
        <section className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)]">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-emerald-800">
            <FaCheckCircle className="text-emerald-600" />
            Agent Registered
          </h2>
          <p className="mt-2 text-sm text-[#4f6359]">Credential NFT minted on Solana Devnet.</p>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#dbe5df] bg-[#f8fbf9] p-3">
              <dt className="text-[11px] uppercase tracking-[0.13em] text-[#5f7369]">Owner wallet</dt>
              <dd className="mt-1 font-mono text-sm text-[#1f3028]">{formatWalletAddress(publicKey?.toBase58())}</dd>
            </div>
            <div className="rounded-xl border border-[#dbe5df] bg-[#f8fbf9] p-3">
              <dt className="text-[11px] uppercase tracking-[0.13em] text-[#5f7369]">Agent ID</dt>
              <dd className="mt-1 font-mono text-sm text-[#1f3028]">agt_8f2k9x</dd>
            </div>
            <div className="rounded-xl border border-[#dbe5df] bg-[#f8fbf9] p-3 sm:col-span-2">
              <dt className="text-[11px] uppercase tracking-[0.13em] text-[#5f7369]">NFT</dt>
              <dd className="mt-1 break-all font-mono text-sm text-[#1f3028]">https://solscan.io/token/7xK...</dd>
            </div>
          </dl>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <div className="grid gap-4 lg:grid-cols-12">
        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-7">
          <h2 className="flex items-center gap-2 text-3xl font-semibold tracking-[-0.02em] text-[#16241d]">
            <FaUserPlus className="text-lg text-emerald-600" />
            New Agent
          </h2>
          <p className="mt-2 text-sm text-[#4f6359]">
            Create an agent identity, set its execution limits, and mint a credential NFT.
          </p>

          <form className="mt-5 space-y-4" onSubmit={submit}>
            <label className="block text-sm text-[#30443a]">
              Agent name
              <input
                className="mt-1.5 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="Trading Bot Alpha"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="block text-sm text-[#30443a]">
              Description
              <textarea
                className="mt-1.5 min-h-28 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                placeholder="What does this agent do?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>

            <label className="block text-sm text-[#30443a]">
              Max transaction (SOL)
              <input
                className="mt-1.5 w-full rounded-xl border border-[#d3dfd8] bg-[#f8fbf9] px-3 py-2.5 text-sm text-[#17261f] outline-none transition-colors duration-150 focus:border-emerald-400"
                type="number"
                placeholder="10"
                value={maxTx}
                onChange={(event) => setMaxTx(event.target.value)}
              />
            </label>

            <button
              type="submit"
              className="rounded-xl bg-[#173528] px-4 py-2 text-sm text-white transition-colors duration-150 hover:bg-[#1e4433] disabled:cursor-not-allowed disabled:bg-[#9fb7ab]"
              disabled={!connected}
            >
              Register and mint NFT
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-[#d3ddd7] bg-white/90 p-6 shadow-[0_10px_30px_rgba(47,74,60,0.08)] lg:col-span-5">
          <div className="flex items-center gap-2 text-[#1b2b23]">
            <FaShieldAlt className="text-sm text-emerald-600" />
            <p className="text-sm font-medium uppercase tracking-[0.16em]">Minting Context</p>
          </div>

          <p className="mt-3 text-sm text-[#4f6359]">
            {connected
              ? `Minting wallet: ${formatWalletAddress(publicKey?.toBase58())}`
              : "Connect a Solana wallet from the top-right before minting a credential NFT."}
          </p>

          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-[#dbe5df] bg-[#f8fbf9] px-3 py-2 text-sm text-[#4b6156]">
              Credential NFT includes owner linkage and agent policy envelope.
            </div>
            <div
              className={`rounded-xl px-3 py-2 text-sm ${
                connected
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              {connected ? "Wallet connected. Ready to mint." : "Wallet not connected."}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
