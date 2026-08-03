import Card from "@/shared/components/Card";
import { menuData } from "../data/menuData";


export default function MenuPage() {
  return (

    <section className="min-h-screen text-white p-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Nuestro Menú
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {menuData.map((product, index) => (
          <Card key={index} product={product} />
        ))}
      </div>
    </section>
  );
}
