import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { NAV_LINKS } from "../../constant/NavLinks";

interface ResponsiveMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function ResponsiveMenu({
  isOpen,
  onToggle,
  onClose,
}: ResponsiveMenuProps) {
  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        className="p-2 text-white hover:bg-indigo-700 rounded-full transition-colors"
      >
        {isOpen ? <RiCloseLine size={24} /> : <RiMenu3Line size={24} />}
      </button>

      {/* Mobile Drawer */}
      <div
        className={`absolute top-16 left-0 w-full bg-indigo-700 border-t border-indigo-500 shadow-lg transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={onClose}
              className="block px-4 py-3 rounded-xl text-indigo-100 hover:text-white hover:bg-indigo-600 transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
