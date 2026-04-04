import { FaChartBar, FaCompass, FaFlask, FaHome, FaLeaf } from "react-icons/fa";
import WalletControls from "./WalletControls";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "landing", label: "Home", icon: FaHome },
  { id: "dashboard", label: "Dashboard", icon: FaChartBar },
  { id: "explorer", label: "Explorer", icon: FaCompass },
  { id: "demo", label: "Demo", icon: FaFlask },
];

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="border-b border-emerald-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex min-h-14 max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-semibold text-emerald-800 transition-colors duration-150 hover:text-emerald-700"
          onClick={() => onNavigate("landing")}
        >
          <FaLeaf className="text-xs" />
          KYA
        </button>
        <nav className="flex flex-1 gap-3 overflow-x-auto text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={
                  currentPage === item.id
                    ? "flex items-center gap-1.5 text-emerald-700 transition-colors duration-150"
                    : "flex items-center gap-1.5 text-gray-500 transition-colors duration-150 hover:text-emerald-700"
                }
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="text-xs" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <WalletControls />
      </div>
    </header>
  );
}
