import Card from "@/shared/components/Card";
import { menuData } from "../data/menuData";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

export default function MenuPage() {
  return (
    <section className="min-h-screen text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Nuestro Menú
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {menuData.map((product, index) => (
          <div key={index} className="relative">
            {/* Renderizamos la tarjeta */}
            <Card product={product} />

            {/* Ojito flotante */}
            <Link
              to={`/dashboard/menu/view/${index + 1}`} 
              className="absolute top-2 right-2 bg-[var(--color-background)] p-2 rounded-full shadow hover:bg-[var(--color-brand-hover)] transition-colors"
            >
              <Eye className="text-[var(--color-brand)]" size={20} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
