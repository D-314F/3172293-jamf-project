export default function Checkbox({
    id,                 //Identificador unico(necesario para accesibilidad)
    name,               //Nombre del campo (util para formulario)
    label,              //Texto visible asociado al checkbox
    checked = false,    //Estado controlado del checkbox
    onChange,           //Funcion que maneja el cambio
    disabled = false,    //Indica si el checkbox esta habilitado
    className = "",     //Clases adicionales para personalizacion
})  {
//Si esta desabilitaodo una opcitdad de 50 si no esta vacio, el ? es ternario si eso es 1, y si es falso no hace nada
    return (
        <label 
            htmlFor={id}
            className={`
                text-white
                flex items-center gap-2
                text-sm
                cutsor-pointer
                ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
                ${className}
            `}
        >
            {/* Input del checkbox */}
            <input 
                id={id}
                name={name}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onChange}
                className="w-5 h-5"
            />

            {/* Texto del checkbox */}
            <span>{label}</span> 
        </label>
    )
}