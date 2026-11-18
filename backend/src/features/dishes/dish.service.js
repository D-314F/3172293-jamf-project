import { dishRepository } from "./dish.repository.js";
import { inventoryRepository } from "../inventory/inventory.repository.js";

function computeEffectiveStock(dish) {
    const rawDishStock = Math.max(0, Number(dish.dish_stock ?? 0));
    if (!dish.inventory_id) return rawDishStock;

    const invQty = Math.max(0, Number(dish.inventory_quantity ?? 0));
    const invActive = dish.inventory_is_active !== false;
    if (!invActive || invQty <= 0) return 0;

    return Math.min(rawDishStock, invQty);
}

function mapDishFromDb(dish) {
    const dishStock = Math.max(0, Number(dish.dish_stock ?? 0));
    const effectiveStock = computeEffectiveStock(dish);

    return {
        id: dish.id,
        dishName: dish.dish_name,
        nombre: dish.dish_name,
        category: dish.dish_category,
        dishCategory: dish.dish_category,
        categoria: dish.dish_category,
        price: Number(dish.dish_price),
        dishPrice: String(dish.dish_price),
        precio: String(dish.dish_price),
        description: dish.dish_description,
        dishDescription: dish.dish_description,
        descripcion: dish.dish_description,
        dishImageUrl: dish.dish_image_url || null,
        inventoryId: dish.inventory_id ? Number(dish.inventory_id) : null,
        inventoryName: dish.inventory_name || null,
        inventoryCodigo: dish.inventory_codigo || null,
        inventoryQuantity:
            dish.inventory_id !== null && dish.inventory_id !== undefined
                ? Number(dish.inventory_quantity ?? 0)
                : null,
        inventoryIsActive:
            dish.inventory_id !== null && dish.inventory_id !== undefined
                ? Boolean(dish.inventory_is_active)
                : null,
        dishStock,
        stock: effectiveStock,
        effectiveStock,
        isActive: dish.is_active,
        activo: dish.is_active,
        status: dish.is_active ? "Habilitado" : "Deshabilitado",
    };
}

function createBadRequestError(message) {
    const err = new Error(message);
    err.statusCode = 400;
    return err;
}

async function validateInventoryStockForDish({
    dishName,
    inventoryId,
    dishStock,
    isActive,
    isStatusOnlyToggle = false,
}) {
    if (!Number.isFinite(dishStock) || dishStock < 0) {
        throw createBadRequestError("El stock del platillo debe ser un número entero mayor o igual a 0.");
    }

    if (!inventoryId) return;

    const inv = await inventoryRepository.findById(inventoryId);
    if (!inv) {
        throw createBadRequestError("El insumo seleccionado en inventario no existe.");
    }

    const invQty = Number(inv.cantidad ?? 0);
    const invActive = Boolean(inv.is_active);

    // Si solo está deshabilitando el platillo manualmente, permitimos guardar
    if (isStatusOnlyToggle && isActive === false) return;

    if ((isActive ?? true) && (!invActive || invQty <= 0)) {
        throw createBadRequestError(
            `No puedes preparar ni habilitar "${dishName}" porque el insumo "${inv.nombre}" está agotado o inactivo en inventario (Stock actual: ${invQty}).`
        );
    }

    if (dishStock > invQty) {
        throw createBadRequestError(
            `Stock insuficiente en inventario: asignaste ${dishStock} porciones a "${dishName}", pero de "${inv.nombre}" solo hay ${invQty} unidad(es) disponibles.`
        );
    }
}

export const dishService = {
    async getAllDishes() {
        const dishes = await dishRepository.findAll();
        return dishes.map(mapDishFromDb);
    },

    async getDishById(id) {
        const dish = await dishRepository.findById(id);
        if (!dish) {
            const err = new Error("Platillo no encontrado");
            err.statusCode = 404;
            throw err;
        }
        return mapDishFromDb(dish);
    },

    async updateDish(id, data) {
        const existing = await dishRepository.findById(id);
        if (!existing) {
            const err = new Error("Platillo no encontrado");
            err.statusCode = 404;
            throw err;
        }

        const rawInvId =
            data.inventoryId !== undefined
                ? data.inventoryId || null
                : data.inventory_id !== undefined
                ? data.inventory_id || null
                : existing.inventory_id;

        const rawStock =
            data.dishStock !== undefined
                ? Number(data.dishStock)
                : data.stock !== undefined
                ? Number(data.stock)
                : Number(existing.dish_stock ?? 0);

        const nextIsActive = data.isActive ?? data.is_active ?? existing.is_active;
        const isStatusOnlyToggle =
            Object.keys(data).length === 1 &&
            (data.isActive !== undefined || data.is_active !== undefined);

        const dishName =
            data.dishName ?? data.nombre ?? data.dish_name ?? existing.dish_name;

        await validateInventoryStockForDish({
            dishName,
            inventoryId: rawInvId,
            dishStock: rawStock,
            isActive: nextIsActive,
            isStatusOnlyToggle,
        });

        const dishData = {
            dishName,
            dishPrice:
                data.dishPrice !== undefined || data.precio !== undefined
                    ? Number(data.dishPrice ?? data.precio)
                    : Number(existing.dish_price),
            dishCategory:
                data.dishCategory ??
                data.categoria ??
                data.dish_category ??
                existing.dish_category,
            dishDescription:
                data.dishDescription ??
                data.descripcion ??
                data.dish_description ??
                existing.dish_description,
            dishImageUrl:
                data.dishImageUrl ??
                data.dish_image_url ??
                data.imagen ??
                existing.dish_image_url,
            inventoryId: rawInvId,
            dishStock: rawStock,
            isActive: nextIsActive,
        };

        return await dishRepository.update(id, dishData);
    },

    async createDish(data) {
        const dishName = data.nombre || data.dishName;
        const inventoryId = data.inventoryId || data.inventory_id || null;
        const dishStock =
            data.dishStock !== undefined || data.stock !== undefined
                ? Number(data.dishStock ?? data.stock)
                : 15;
        const isActive = data.isActive ?? true;

        await validateInventoryStockForDish({
            dishName,
            inventoryId,
            dishStock,
            isActive,
        });

        const dishData = {
            dishName,
            dishPrice: Number(data.precio || data.dishPrice),
            dishCategory: data.categoria || data.dishCategory,
            dishDescription: data.descripcion || data.dishDescription,
            dishImageUrl:
                data.dishImageUrl ?? data.dish_image_url ?? data.imagen ?? null,
            inventoryId,
            dishStock,
            isActive,
        };

        return await dishRepository.create(dishData);
    },
};
