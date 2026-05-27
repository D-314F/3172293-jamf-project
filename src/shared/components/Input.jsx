export default function Input({
    label,
    htmlFor, //Es para accesibilidad, la persona que tiene una discapacidad va a escuchar el texto que esta ahi con tab
    type = "text",
    variant="primary",
    size = "sm",
    ...props
}){
    
    const variants = {
            //Estos valores deben ser con variables 
        primary: `
             border-brand
             bg-background
        `, 
        secondary: `
            border-red-300
            bg-gray-300
        `, 
        tertiary: `
            border-green-950
        `
    }
    const sizes = {
        
        sm: `
            h-8
            
        `, 
        md: `
            h-10
        `, 
        lg: `
            h-12
        `
    }


    return(
        <div className="w-80">
                {/*Label */}
            <label 
                // htmlFor con kebab-case
                htmlFor={htmlFor}
                className={`
                    block
                    text-caption
                    mb-1
                    text-secondary
                    // nuevo
                    text-white

                    ${
                        size === "sm"
                            ? "-mb-2"
                        : size === "md"
                            ? "-mb-0"
                            : "-mb-1"
                    }
                `}
            >
                
                {label}
            </label>

                {/* Contenedor del input */}
                <div 

                    className="
                        relative
                        h-12
                        flex
                        items-center
                    "
                >
                {/* Area interactiva invisible (48px)*/}
                <div
                    className="
                        absolute
                        inset-0
                    "

                    onMouseDown={(e) => {
                        e.preventDefault();
                        //Mueve el foco al siguiente nodo hermano en el DOM
                        //nextSibling puede ser texto; si no es elemento valido,
                        e.currentTarget.nextSibling.focus();
                    }}
                />


                {/* Input visual */}
                <input
                    id={htmlFor}
                    type={type}
                    className={`
                        relative
                        w-full
                        rounded-md
                        border
                        px-4
                        text-body
                        
                        

                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                        focus:ring-brand
                        ${variants[variant]}
                        ${sizes[size]}
                    `}
                        {...props}
                    />
            </div>
        </div>
    );
}
