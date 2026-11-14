export default function Checkbox({
    id,
    name,
    label,
    checked = false,
    onChange,
    disabled = false,
    className = "",
    }) {
    return (
        <label
        htmlFor={id}
        className={`
            text-[var(--color-text-inverse)]
            flex items-center gap-2.5
            text-medium font-[var(--font-body)]
            cursor-pointer select-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${className}
        `}
        >
        <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="w-5 h-5 rounded accent-[var(--color-brand)] cursor-pointer disabled:cursor-not-allowed"
        />
        <span>{label}</span>
        </label>
    );
}