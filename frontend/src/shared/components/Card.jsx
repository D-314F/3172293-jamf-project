// src/shared/components/Card.jsx
export default function Card({
  product,
  title,
  description,
  imageUrl,
  price,
  formattedPrice,
  categoryBadge,
  statusBadge,
  metaRight,
  footerIcon,
  highlighted = false,
  surface = "inverse",
  imageHeightClass = "h-44",
  className = "",
  children,
}) {
  const resolvedTitle = title ?? product?.title ?? "Sin título";
  const resolvedDescription = description ?? product?.description ?? "";
  const resolvedImage = imageUrl ?? product?.imageUrl ?? product?.image ?? "";
  const resolvedPrice =
    formattedPrice ??
    `$${Number(price ?? product?.price ?? 0).toLocaleString("es-CO")}`;

  const containerSurface =
    surface === "dark" ? "bg-[var(--color-surface-dark)]" : "bg-[var(--color-background-inverse)]";

  return (
    <article
      className={`
        group w-full h-full
        ${containerSurface}
        border rounded-2xl overflow-hidden shadow-lg
        text-[var(--color-text-inverse)]
        transition-all duration-200 flex flex-col justify-between
        ${
          highlighted
            ? "border-[var(--color-brand)] ring-1 ring-[var(--color-brand)]/50"
            : "border-[var(--color-brand)]/25 hover:border-[var(--color-brand)]"
        }
        ${className}
      `}
    >
      <div>
        {/* Imagen + Badges */}
        <div
          className={`relative w-full ${imageHeightClass} overflow-hidden bg-[var(--color-surface-dark)] shrink-0`}
        >
          {resolvedImage && (
            <img
              src={resolvedImage}
              alt={resolvedTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}

          {categoryBadge && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-small font-semibold bg-[var(--color-background-inverse)]/90 text-[var(--color-brand)] border border-[var(--color-brand)]/30 backdrop-blur-sm">
              {categoryBadge}
            </span>
          )}

          {statusBadge && (
            <span
              className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-small font-bold shadow ${
                statusBadge.tone === "error"
                  ? "bg-[var(--color-error)] text-[var(--color-text-on-solid)]"
                  : statusBadge.tone === "brand"
                  ? "bg-[var(--color-brand)] text-[var(--color-text-primary)]"
                  : "bg-black/75 text-white backdrop-blur-sm"
              }`}
            >
              {statusBadge.label}
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4 flex flex-col gap-2">
          <h2 className="text-base font-bold font-[var(--font-heading)] text-[var(--color-text-inverse)] line-clamp-1">
            {resolvedTitle}
          </h2>

          {resolvedDescription && (
            <p className="text-medium font-[var(--font-body)] text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
              {resolvedDescription}
            </p>
          )}
        </div>
      </div>

      {/* Pie de tarjeta / Acciones */}
      <div className="px-4 pb-4 pt-3 border-t border-[var(--color-border)]/15 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {!metaRight && (
              <span className="text-medium text-[var(--color-text-muted)] font-[var(--font-label)]">
                Precio
              </span>
            )}
            <span className="text-base font-extrabold text-[var(--color-brand)]">
              {resolvedPrice}
            </span>
          </div>

          {metaRight ? (
            <span className="text-medium text-[var(--color-text-muted)]">
              {metaRight}
            </span>
          ) : (
            footerIcon && (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/15 border border-[var(--color-brand)]/30 flex items-center justify-center text-[var(--color-brand)] shrink-0">
                {footerIcon}
              </div>
            )
          )}
        </div>

        {children && <div className="mt-6">{children}</div>}
      </div>
    </article>
  );
}
