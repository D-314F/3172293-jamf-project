import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  cloneElement,
} from "react";
import { X } from "lucide-react";

export const DropdownContext = createContext(null);

export function Dropdown({
  children,
  open: controlledOpen,
  onOpenChange,
  className = "",
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }
  };

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({ children }) {
  const { open, setOpen } = useContext(DropdownContext);

  if (!children) return null;

  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e);
      setOpen(!open);
    },
    "aria-expanded": open,
    "aria-haspopup": "menu",
  });
}

export function DropdownContent({ children, className = "" }) {
  const { open, setOpen } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      role="menu"
      className={`
        absolute right-0 top-full mt-2.5
        w-64 sm:w-72 h-auto max-h-[82vh] overflow-y-auto
        rounded-2xl shadow-2xl
        border border-[var(--color-brand)]/40
        bg-[var(--color-background-inverse)]
        text-[var(--color-text-inverse)]
        font-[var(--font-body)]
        p-2.5
        z-50
        ${className}
      `}
    >
      {/* Cabecera compacta solo en Mobile */}
      <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[var(--color-border)]/15 md:hidden">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand)] font-[var(--font-heading)]">
          Navegación POS
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="w-7 h-7 rounded-full bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

export function DropdownItem({ children, onClick, className = "" }) {
  const { setOpen } = useContext(DropdownContext);

  const handleClick = (e) => {
    onClick?.(e);
    setOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      onClick={handleClick}
      className={`
        w-full text-left px-3 py-2.5 rounded-xl
        text-sm font-medium
        hover:bg-[var(--color-surface-dark)]
        active:scale-[0.99]
        transition-all cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}