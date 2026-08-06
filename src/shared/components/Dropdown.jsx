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
export function DropdownContent({ children, className = "" }) {
  const { open } = useContext(DropdownContext)


  if (!open) return null //Si está cerrado, ni renderiza el menú

  return (
    <div
      role="menu"
      className={`
        absolute
        mt-1
        min-w-48
        border
        text-text-inverse
        p-1
        dark:bg-neutral-950/80
        backdrop-blur-[1px]
        shadow-lg
        rounded-2xl
        overflow-hidden
        hover:shadow-black
        transition-shadow duration-700
        ${className}
      `}
    >
      {children}
    </div>
  )
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