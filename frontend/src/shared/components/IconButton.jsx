// Ruta: frontend/src/shared/components/IconButton.jsx
import React from "react";
import clsx from "clsx";

/**
 * IconButton estandarizado con Design Tokens (Material Design 3)
 * - Área táctil invisible (hit area) mínima de 48x48 px (estándar Google M3)
 * - Área visible compacta dentro del target táctil para mantener filas entre 48-72 px
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
        sm: { hit: 48, visual: 36, icon: 18 },
        md: { hit: 48, visual: 42, icon: 20 },
        lg: { hit: 52, visual: 48, icon: 24 },
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const resolvedHitSize = Math.max(48, hitSize ?? currentSize.hit);
    const resolvedVisualSize = currentSize.visual;
    const resolvedIconSize = iconSize ?? currentSize.icon;

    const baseStyles = `
        group inline-flex items-center justify-center
        rounded-full cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
    `;

    const visualBase = `
        inline-flex items-center justify-center
        rounded-full transition-all duration-200 ease-out
        group-hover:scale-110 group-active:scale-95
    `;

    // Variantes conectadas a los tokens semánticos M3 de global.css
    const variants = {
        default: `
            text-[var(--color-text-primary)]
            group-hover:bg-[var(--color-surface-muted)]
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        ghost: `
            text-[var(--color-text-secondary)]
            group-hover:bg-[var(--color-surface-muted)]
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        primary: `
            bg-[var(--color-brand)]
            text-[var(--color-text-primary)]
            group-hover:bg-[var(--color-brand-hover)]
            shadow-sm group-hover:shadow-md
            focus-visible:ring-[var(--color-focus-ring)]
        `,
        danger: `
            bg-[var(--color-brand-soft)]/15
            text-[var(--color-brand-soft-hover)]
            group-hover:bg-[var(--color-brand-soft)]
            group-hover:text-[var(--color-text-on-solid)]
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
            className={clsx(baseStyles)}
            style={{
                width: `${resolvedHitSize}px`,
                height: `${resolvedHitSize}px`,
                minWidth: `${resolvedHitSize}px`,
                minHeight: `${resolvedHitSize}px`,
            }}
            {...props}
        >
            <span
                className={clsx(
                    visualBase,
                    variants[variant] || variants.default,
                    className,
                    {
                        "bg-[var(--color-surface-muted)]": isActive,
                    }
                )}
                style={{
                    width: `${resolvedVisualSize}px`,
                    height: `${resolvedVisualSize}px`,
                }}
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
            </span>
        </button>
    );
});
