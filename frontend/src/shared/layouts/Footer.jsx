// src/shared/layouts/Footer.jsx
export default function Footer() {
  return (
    <footer className="w-full bg-[var(--color-background-inverse)] text-[var(--color-text-inverse)] border-t border-[var(--color-brand)] py-6 px-8 text-center text-sm mt-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="opacity-80">
            © {new Date().getFullYear()} Sistema JAMF — Todos los derechos reservados.
          </p>
          <p className="opacity-60 mt-1">
            Desarrollado por Fabian Guzman Villegas,    James Machado Hernández,    Maycol Stiven Silva  | Versión 1.0.0
          </p>
        </div>

        <div className="flex gap-4 justify-center md:justify-end">
          <a href="https://legal.epicgames.com/epicgames/privacy-policy" className="hover:text-[var(--color-brand)] transition">Política de privacidad</a>
          <a href="https://legal.epicgames.com/epicgames/tos" className="hover:text-[var(--color-brand)] transition">Términos del Servicio</a>
          <a href="https://www.epicgames.com/site/about" className="hover:text-[var(--color-brand)] transition">Acerca de JAMF</a>
        </div>
      </div>
    </footer>
  );
}
