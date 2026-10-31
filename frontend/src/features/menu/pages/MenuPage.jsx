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
      
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
        {menuData.map((product, index) => (
          <div key={index} className="relative h-full flex flex-col">
            <Card product={product} className="h-full" />

            {/* Ojito flotante */}
            <Link
              to={`/dashboard/menu/view/${index + 1}`} 
              className="absolute top-2 right-2 bg-[var(--color-background)] p-2 rounded-full shadow hover:bg-[var(--color-brand-hover)] transition-colors z-10"
            >
              <Eye className="text-[var(--color-brand)]" size={20} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}