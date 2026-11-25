// frontend/src/shared/components/Dropdown.jsx
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  cloneElement,
} from "react";
import { X } from "lucide-react";
import { DropdownContext } from "./dropdownContext";

export function Dropdown({
  children,
  open: controlledOpen,
  onOpenChange,
  className = "",
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (value) => {
      if (isControlled) {
        onOpenChange?.(value);
      } else {
        setUncontrolledOpen(value);
      }
    },
    [isControlled, onOpenChange]
  );

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [setOpen]);

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
        absolute right-0 top-full mt-3
        w-72 sm:w-80 h-auto
        rounded-3xl shadow-2xl
        border border-[var(--color-brand)]/45
        bg-[var(--color-background-inverse)]
        text-[var(--color-text-inverse)]
        font-[var(--font-body)]
        p-3
        z-50
        ${className}
      `}
    >
      {/* Flecha superior (caret) que conecta el Dropdown como extensión del perfil */}
      <span
        aria-hidden="true"
        className="hidden md:block absolute -top-2 right-7 w-3.5 h-3.5 rotate-45 bg-[var(--color-background-inverse)] border-l border-t border-[var(--color-brand)]/45"
      />

      {/* Cabecera compacta solo en Mobile */}
      <div className="flex items-center justify-between px-3 py-2 mb-1.5 border-b border-[var(--color-border)]/15 md:hidden">
        <span className="text-caption font-bold uppercase tracking-wider text-[var(--color-brand)] font-[var(--font-heading)]">
          Navegación POS
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="min-w-[48px] min-h-[48px] rounded-full bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] hover:text-[var(--color-brand)] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-0.5">{children}</div>
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
        w-full text-left min-h-[48px] px-3 py-2 rounded-xl
        text-medium font-medium flex items-center
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
