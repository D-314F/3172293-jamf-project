// Componente Button arreglado sin borde amarillo
export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    className = "",
    ...props
}) {
const variants = {
    // Primario (Amarillo): texto negro y font-bold para legibilidad impecable
    primary: "bg-brand text-black font-bold hover:bg-brand-hover",
    
    // Secundario (Rojo/Coral): fondo suave, texto blanco en negrita sin bordes
    secondary: "bg-brand-soft text-white hover:bg-brand-soft-hover",
};

  const sizes = {
    sm: "h-8 px-4 text-xs inline-flex items-center justify-center",
    md: "h-10 px-4 text-sm inline-flex items-center justify-center",
  };

return (
    <button
        type={type}
        className={`
            rounded-md
            transition-colors
            cursor-pointer
            ${variants[variant] || variants.primary}
            ${sizes[size] || sizes.md}
            ${className}
        `}
    {...props}
    >
    {children}
    </button>
    );
}