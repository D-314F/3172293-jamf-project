import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  cloneElement
} from "react"

export const DropdownContext = createContext(null) //EL PAPÁ

export function Dropdown({
  children,
  open: controlledOpen,
  onOpenChange,
  className = ""
}) {

    //NO CONTROLADO - El dropdown maneja su propio estado de abierto/cerra
    //MODO CONTROLADO - Tú decides desde afuera si está abierto o cerrado
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : uncontrolledOpen

    // Si no se pone el onchange en el controlado se queda ahi. nunca cambia porq ue nadie escucha el evento 
 const setOpen = (value) => {
    if (isControlled) {
      onOpenChange?.(value)  // Le avisa al papa
    } else {
      setUncontrolledOpen(value) // Lo cambia el mismo
    }
  }

  

  const containerRef = useRef(null)

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside) //mousedown escucha todos los clicks
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])



  // Escape key, esto es accesibilidad todos los dropdowns se cierran con Esc
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])


  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// Trigger (asChild pattern)
export function DropdownTrigger({ children }) {
  const { open, setOpen } = useContext(DropdownContext)

  if (!children) return null


  return cloneElement(children, {
    onClick: (e) => {
      children.props.onClick?.(e)
      setOpen(!open)
    },
    "aria-expanded": open, // Accesibilidad le dice este boton tiene un menú y ahora esta abierto/cerrado.
    "aria-haspopup": "menu"
  })
}

// Content
// Esto aparece cuando le das clic
// Content
// En Dropdown.jsx -> DropdownContent
export function DropdownContent({ children, className = "" }) {
  const { open, setOpen } = useContext(DropdownContext);

  if (!open) return null;

  return (
    <div
      role="menu"
      className={`
        /* Mobile sidebar */
        fixed top-0 left-0 h-full w-64 rounded-r-2xl

        /* Desktop dropdown (Alineado debajo de la barra y pegado a la derecha) */
        md:absolute md:top-full md:mt-2.5 md:right-0 md:left-auto md:w-64 md:h-auto md:rounded-xl md:shadow-2xl

        border border-[var(--color-brand)] 
        bg-[var(--color-background-inverse)]       
        text-[var(--color-text-inverse)]           
        font-[var(--font-body)]
        p-4
        z-50
        ${className}
      `}
    >
      <button
        onClick={() => setOpen(false)}
        className="mb-4 text-sm text-[var(--color-error)] font-[var(--font-heading)] md:hidden"
      >
        ✕ Cerrar
      </button>
      {children}
    </div>
  );
}



// Item
export function DropdownItem({
  children,
  onClick,
  className = ""
}) {
  const { setOpen } = useContext(DropdownContext)

  const handleClick = (e) => {
    onClick?.(e)
    setOpen(false) // Se cierra solo al darle click
  }

  return (
    <button
      role="menuitem"
      onClick={handleClick}
      className={`
        w-full text-left px-3 py-2 rounded-lg
        hover:bg-gray-500 focus:bg-gray-100
        transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  )
}