// Componente Select 
export default function Select({
    label,
    error,
    htmlFor,
    name,
    onChange,
    value,
    options = [],
    className = "", // 1. Añadimos className por si lo queremos personalizar
}){
    return (
        <div>
            {label &&(
                <label 
                    htmlFor={htmlFor}
                    className={`
                        block 
                        text-caption
                        text-secondary
                        text-white
                        ${error ? "text-red-800" : "text-secondary"}
                    `}
                >
                    {label}
                </label>
            )}

            <select
                name={name}
                onChange={onChange}
                value={value}
                id={htmlFor}
                className={`
                    w-80
                    h-10
                    rounded-md
                    border
                    px-4
                    ${error ? "border-red-800" : "border-border"}
                    ${className || "bg-white text-black"} 
                `}
            >
            <option value="">Seleccione una opción</option> 

               {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
        ))}
            </select>
            {error && (
                <p className="text-caption text-red-800 place-self-start mt-1">{error}</p>
            )}
        </div>
    )
}