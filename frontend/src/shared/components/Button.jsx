// src/shared/components/Button.jsx
export default function Button({
    variant = "primary",
    size = "md",
    type = "button",
    children,
    className = "",
    ...props
    }) {
    const variants = {
        primary:
        "bg-[var(--color-brand)] text-[var(--color-text-primary)] font-[var(--font-heading)] hover:bg-[var(--color-brand-hover)] shadow-sm",
        secondary:
        "bg-[var(--color-brand-soft)] text-[var(--color-text-inverse)] font-[var(--font-heading)] hover:bg-[var(--color-brand-soft-hover)] shadow-sm",
    };

    const sizes = {
        sm: "h-9 px-4 text-small inline-flex items-center justify-center gap-1.5",
        md: "h-10 px-5 text-medium inline-flex items-center justify-center gap-2",
    };

    return (
        <button
        type={type}
        className={`
            rounded-xl
            transition-all duration-200
            cursor-pointer
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
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