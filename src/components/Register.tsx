import { useState, type FormEvent } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaCheckCircle, FaUserPlus } from "react-icons/fa";
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
      <main className="mx-auto max-w-xl px-4 py-6">
        <h2 className="flex items-center gap-2 text-lg font-medium text-emerald-900">
          <FaCheckCircle className="text-emerald-600" />
          Agent registered
        </h2>
        <p className="mt-1 text-sm text-gray-600">Credential NFT minted on Solana Devnet.</p>
        <p className="mt-4 text-sm text-gray-600">
          Owner wallet: <span className="font-mono text-gray-900">{formatWalletAddress(publicKey?.toBase58())}</span>
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Agent ID: <span className="font-mono text-gray-900">agt_8f2k9x</span>
        </p>
        <p className="text-sm text-gray-600">
          NFT: <span className="font-mono text-gray-900">https://solscan.io/token/7xK...</span>
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-6">
      <h2 className="flex items-center gap-2 text-2xl font-medium text-emerald-900">
        <FaUserPlus className="text-base text-emerald-600" />
        New agent
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        {connected
          ? `Minting wallet: ${formatWalletAddress(publicKey?.toBase58())}`
          : "Connect a Solana wallet from the top right before minting a credential NFT."}
      </p>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        <label className="block text-sm text-gray-700">
          Agent name
          <input
            className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
            placeholder="Trading Bot Alpha"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="block text-sm text-gray-700">
          Description
          <textarea
            className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
            placeholder="What does this agent do?"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>

        <label className="block text-sm text-gray-700">
          Max transaction (SOL)
          <input
            className="mt-1 w-full rounded border border-emerald-200 px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-emerald-400"
            type="number"
            placeholder="10"
            value={maxTx}
            onChange={(event) => setMaxTx(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="rounded bg-emerald-700 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          disabled={!connected}
        >
          Register and mint NFT
        </button>
      </form>
    </main>
  );
}
