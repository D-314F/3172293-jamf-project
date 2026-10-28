// src/shared/components/IconButton.jsx
import React from "react";
import clsx from "clsx";

/**
 * IconButton estandarizado con Design Tokens (Material Design 3)
 * - Area táctil (hit area): tamaño del botón
 * - Area visible: tamaño del ícono (controlado por wrapper interno)
 */
export const IconButton = React.forwardRef(function IconButton(
    {
        children,
        onClick,
        disabled = false,
        className = "",
        variant = "default",
        size = "md",

        // Tamaños opcionales
        hitSize,
        iconSize,

        // Accesibilidad
        ariaLabel,

        // Estados
        isActive = false,

        ...props
    },
    ref
) {
    const sizeMap = {
        sm: { hit: 36, icon: 18 },
        md: { hit: 42, icon: 20 },
        lg: { hit: 48, icon: 24 },
    };

    const resolvedHitSize = hitSize ?? (sizeMap[size]?.hit || 42);
    const resolvedIconSize = iconSize ?? (sizeMap[size]?.icon || 20);

    const baseStyles = `
        inline-flex items-center justify-center
        rounded-full cursor-pointer
        transition-all duration-200 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
    `;

    // Variantes conectadas a los tokens semánticos M3 de global.css
    const variants = {
        default: `
            text-[var(--color-text-primary)]
            hover:bg-[var(--color-surface-muted)]
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        ghost: `
            text-[var(--color-text-secondary)]
            hover:bg-[var(--color-surface-muted)]
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        primary: `
            bg-[var(--color-brand)]
            text-[var(--color-text-primary)]
            hover:bg-[var(--color-brand-hover)]
            shadow-sm hover:shadow-md
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        danger: `
            bg-[var(--color-brand-soft)]/15
            text-[var(--color-brand-soft-hover)]
            hover:bg-[var(--color-brand-soft)]
            hover:text-[var(--color-text-inverse)]
            focus-visible:ring-[var(--color-brand-soft)]
        `,
    };

    return (
        <button
            ref={ref}
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}
            onClick={onClick}
            className={clsx(
                baseStyles,
                variants[variant] || variants.default,
                className,
                {
                    "bg-[var(--color-surface-muted)]": isActive,
                }
            )}
            style={{
                width: `${resolvedHitSize}px`,
                height: `${resolvedHitSize}px`,
            }}
            {...props}
        >
            <span
                style={{
                    width: `${resolvedIconSize}px`,
                    height: `${resolvedIconSize}px`,
                }}
                className="flex items-center justify-center"
            >
                {children}
            </span>
        </button>
    );
});