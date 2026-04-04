import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { FaCheckCircle, FaChevronDown, FaCopy, FaExchangeAlt, FaPowerOff, FaWallet } from "react-icons/fa";
import { formatWalletAddress } from "../utils/formatWalletAddress";

export default function WalletControls() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connected, connecting, disconnect, publicKey, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", closeMenu);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const address = publicKey?.toBase58();

  const openWalletModal = () => {
    setVisible(true);
    setMenuOpen(false);
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
  };

  const handleDisconnect = async () => {
    setMenuOpen(false);
    await disconnect();
  };

  if (!connected) {
    return (
      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 sm:flex">
          <FaWallet className="text-xs text-emerald-600" />
          Solana Devnet
        </span>
        <button
          type="button"
          className="flex items-center gap-2 rounded bg-emerald-700 px-3 py-1.5 text-sm text-white transition-colors duration-150 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
          onClick={openWalletModal}
          disabled={connecting}
        >
          <FaWallet className="text-xs" />
          {connecting ? "Connecting..." : "Connect wallet"}
        </button>
      </div>
    );
  }

  return (
    <div className="ml-auto" ref={menuRef}>
      <div className="relative">
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-emerald-200 bg-white px-3 py-1.5 text-sm text-emerald-800 shadow-sm transition-colors duration-150 hover:border-emerald-300 hover:bg-emerald-50"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <FaWallet className="text-xs" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-emerald-500">Wallet</span>
            <span className="block font-medium text-gray-900">{formatWalletAddress(address)}</span>
          </span>
          <FaChevronDown className={`text-xs text-emerald-500 transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        {menuOpen ? (
          <div className="absolute right-0 z-20 mt-2 w-72 rounded-2xl border border-emerald-100 bg-white p-3 shadow-lg shadow-emerald-100/80">
            <div className="rounded-xl bg-emerald-50 p-3">
              <p className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <FaCheckCircle className="text-xs text-emerald-600" />
                Wallet connected
              </p>
              <p className="mt-1 text-xs text-emerald-700">{wallet?.adapter.name ?? "Solana wallet"}</p>
              <p className="mt-2 break-all font-mono text-xs text-gray-700">{address}</p>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-gray-700 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={copyAddress}
              >
                <span className="flex items-center gap-2">
                  <FaCopy className="text-xs text-emerald-600" />
                  {copied ? "Copied address" : "Copy address"}
                </span>
                <span className="text-xs text-gray-400">{copied ? "Done" : ""}</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-gray-700 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={openWalletModal}
              >
                <FaExchangeAlt className="text-xs text-emerald-600" />
                Change wallet
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-gray-700 transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={handleDisconnect}
              >
                <FaPowerOff className="text-xs text-emerald-600" />
                Disconnect
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
