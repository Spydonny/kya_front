import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@solana/wallet-adapter-react-ui/styles.css";
import "virtual:windi.css";
import "./index.css";
import App from "./App.tsx";
import SolanaWalletProvider from "./components/SolanaWalletProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </StrictMode>,
);
