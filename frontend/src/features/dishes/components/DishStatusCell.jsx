import StatusSwitch from "@/shared/components/StatusSwitch";
import { updateDish } from "../services/dishServices";

export default function DishStatusCell({ dish, canEdit = true }) {
  const realStatus = Boolean(dish.isActive ?? dish.status === "Habilitado");

  const handleChange = async (value) => {
    await updateDish(dish.id, { isActive: value });

    window.dispatchEvent(
      new CustomEvent("jamf:dish-status-updated", {
        detail: { id: dish.id, isActive: value },
      })
    );
  };

  return (
    <StatusSwitch
      checked={realStatus}
      disabled={!canEdit}
      onChange={handleChange}
      itemName={`el platillo "${dish.dishName}"`}
    />
  );
}
