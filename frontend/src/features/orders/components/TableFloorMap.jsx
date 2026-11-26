import { useState, useRef } from "react";
import {
  Pencil,
  Plus,
  Save,
  X,
  Users,
  Trash2,
  Move,
  Layers,
  Check,
} from "lucide-react";
import { IconButton } from "@/shared";
import {
  showConfirmDeleteAlert,
  showSuccessAlert,
  showUserErrorAlert,
} from "@/shared/services/alertService";
import {
  createRestaurantFloor,
  createRestaurantTable,
  saveTablesLayout,
  deleteRestaurantTable,
} from "../services/tableServices";

/**
 * Subcomponente visual reutilizable de una Mesa con sus sillas alrededor (Material Design 3 >= 48x48px).
 */
function TableVisualNode({
  table,
  isSelected,
  isOccupied,
  occupiedInfo,
  isEditMode,
  isDragging,
  onSelect,
  onPointerDown,
  onDelete,
}) {
  const capacity = Math.max(2, Math.min(8, Number(table.capacity) || 4));
  const shape = table.shape || (capacity >= 6 ? "rect" : "square");

  // Distribución visual de sillas arriba y abajo de la mesa
  const topChairs = Math.ceil(capacity / 2);
  const bottomChairs = Math.floor(capacity / 2);

  // Paleta según estado: Seleccionada, Ocupada o Disponible
  const surfaceClasses = isSelected
    ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)] shadow-[0_0_18px_rgba(212,175,55,0.45)] ring-2 ring-[var(--color-brand)]/40"
    : isOccupied && !isEditMode
    ? "bg-[var(--color-brand-soft)]/18 text-[var(--color-brand-soft)] border-[var(--color-brand-soft)]/60 opacity-90"
    : "bg-[var(--color-surface-darker)]/95 text-[var(--color-text-inverse)] border-[var(--color-border)] hover:border-[var(--color-brand)]/70";

  const chairColor = isSelected
    ? "bg-[var(--color-brand)] border-[var(--color-text-primary)]/40"
    : isOccupied && !isEditMode
    ? "bg-[var(--color-brand-soft)]/45 border-[var(--color-brand-soft)]/70"
    : "bg-[var(--color-surface-dark)] border-[var(--color-brand)]/45";

  const widthClass =
    shape === "rect"
      ? "min-w-[82px] sm:min-w-[96px]"
      : "min-w-[60px] sm:min-w-[68px]";

  const radiusClass = shape === "round" ? "rounded-full" : "rounded-xl";

  return (
    <div
      style={{
        left: `${table.posX}%`,
        top: `${table.posY}%`,
      }}
      onPointerDown={(e) => {
        if (isEditMode) {
          onPointerDown(e, table);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isEditMode) {
          onSelect(table);
        }
      }}
      title={
        isEditMode
          ? `Arrastra para mover ${table.displayName || table.tableCode}`
          : isOccupied
          ? `Mesa ${table.tableCode} — Ocupada (Orden #${occupiedInfo.id}: ${occupiedInfo.estado})`
          : `Seleccionar Mesa ${table.tableCode} (${capacity} puestos)`
      }
      className={`absolute -translate-x-1/2 -translate-y-1/2 select-none transition-transform ${
        isEditMode
          ? isDragging
            ? "cursor-grabbing scale-110 z-30"
            : "cursor-grab hover:scale-105 z-20"
          : isOccupied
          ? "cursor-not-allowed z-10"
          : "cursor-pointer hover:scale-105 active:scale-95 z-10"
      }`}
    >
      {/* Sillas superiores */}
      <div className="flex items-center justify-center gap-1.5 mb-1 pointer-events-none">
        {Array.from({ length: topChairs }).map((_, idx) => (
          <span
            key={`top-${idx}`}
            className={`h-1.5 w-4 rounded-t-md border ${chairColor} transition-colors`}
          />
        ))}
      </div>

      {/* Superficie táctil de la mesa (Mínimo 48x48px MD3) */}
      <div
        className={`relative min-h-[48px] ${widthClass} px-2.5 py-1.5 ${radiusClass} border-2 flex flex-col items-center justify-center transition-all ${surfaceClasses}`}
      >
        {/* Indicador de arrastre o botón eliminar en modo edición */}
        {isEditMode && (
          <>
            <span className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[var(--color-brand)] text-[var(--color-text-primary)] flex items-center justify-center shadow">
              <Move className="w-3 h-3" />
            </span>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(table);
              }}
              aria-label={`Eliminar mesa ${table.tableCode}`}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[var(--color-brand-soft)] text-white flex items-center justify-center shadow hover:scale-110 transition cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}

        {/* Código / Nombre de la mesa (ej. A1, A2) */}
        <span className="text-xs sm:text-sm font-extrabold tracking-tight leading-none">
          {table.displayName || table.tableCode}
        </span>

        {/* Subtítulo: estado u ocupación / capacidad */}
        <div className="flex items-center gap-1 mt-0.5 text-[10px] font-semibold opacity-85 leading-none">
          {isOccupied && !isEditMode ? (
            <span className="uppercase tracking-wider text-[9px] font-bold">
              Ocupada
            </span>
          ) : (
            <>
              <Users className="w-2.5 h-2.5" />
              <span>{capacity}</span>
            </>
          )}
        </div>
      </div>

      {/* Sillas inferiores */}
      <div className="flex items-center justify-center gap-1.5 mt-1 pointer-events-none">
        {Array.from({ length: bottomChairs }).map((_, idx) => (
          <span
            key={`bot-${idx}`}
            className={`h-1.5 w-4 rounded-b-md border ${chairColor} transition-colors`}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Mapa 2D interactivo de Gestión de Pisos y Mesas para Tablet/POS.
 * - Modo Selección (por defecto): el mesero toca una mesa (>=48x48px) para asignarla a la orden sin riesgo de moverla.
 * - Modo Edición (activado por el botón de lápiz con alerta de confirmación): permite arrastrar mesas con el dedo o cursor,
 *   crear nuevas mesas (A1, A2, B1...) y agregar un Segundo Piso con el botón '+' debajo del lápiz.
 */
export default function TableFloorMap({
  floors = [],
  tables = [],
  selectedTableNumber,
  occupiedTables = {},
  onSelectTable,
  onFloorsAndTablesChange,
}) {
  const [activeFloorId, setActiveFloorId] = useState(
    () => floors[0]?.id || 1
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [draftTables, setDraftTables] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Panel inline para agregar nueva mesa
  const [showAddTableForm, setShowAddTableForm] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState(4);
  const [newTableShape, setNewTableShape] = useState("square");

  // Panel inline para agregar nuevo piso
  const [showAddFloorForm, setShowAddFloorForm] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");

  const canvasRef = useRef(null);

  // Garantizar piso activo válido
  const currentFloor =
    floors.find((f) => Number(f.id) === Number(activeFloorId)) || floors[0];

  const sourceTables = isEditMode ? draftTables : tables;
  const floorTables = sourceTables.filter(
    (t) => Number(t.floorId) === Number(currentFloor?.id)
  );

  // Sugerencia automática por defecto para la siguiente mesa del piso (ej. A1, A2... o B1, B2...)
  const nextSuggestedCode = (() => {
    const prefix = currentFloor?.prefix || "A";
    const count = floorTables.length + 1;
    return `${prefix}${count}`;
  })();

  // 1. Activar Modo Edición con Confirmación previa
  const handleToggleEditClick = async () => {
    if (!isEditMode) {
      const result = await showConfirmDeleteAlert({
        title: "¿Estás seguro de editar las mesas?",
        text: "Se habilitará el modo de edición para mover las mesas con el dedo o cursor, agregar nuevas mesas o pisos.",
        confirmButtonText: "Sí, editar mesas",
        cancelButtonText: "No, cancelar",
      });

      if (!result.isConfirmed) return;

      setDraftTables(tables.map((t) => ({ ...t })));
      setIsEditMode(true);
      setShowAddTableForm(false);
      setShowAddFloorForm(false);
    } else {
      // Salir sin guardar
      setIsEditMode(false);
      setDraftTables([]);
      setShowAddTableForm(false);
    }
  };

  // 2. Guardar posiciones de mesas con Confirmación previa
  const handleSaveLayout = async () => {
    const result = await showConfirmDeleteAlert({
      title: "¿Estás seguro de guardar la distribución de las mesas?",
      text: "Se guardarán las nuevas posiciones y cambios de las mesas del restaurante.",
      confirmButtonText: "Sí, guardar cambios",
      cancelButtonText: "No, seguir editando",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSaving(true);
      const res = await saveTablesLayout(draftTables);
      const updatedList = res.tables || draftTables;
      onFloorsAndTablesChange(floors, updatedList);
      setIsEditMode(false);
      setDraftTables([]);
      setShowAddTableForm(false);
      await showSuccessAlert({
        title: "Distribución guardada",
        text: "El mapa de mesas se actualizó correctamente.",
        timer: 1800,
      });
    } catch (err) {
      showUserErrorAlert({
        title: "No se pudo guardar",
        text: err.message || "Error al guardar la distribución de las mesas.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Botón '+' debajo del lápiz para agregar un Segundo Piso / Nuevo Nivel
  const handleOpenAddFloor = async () => {
    const nextNum = floors.length + 1;
    const result = await showConfirmDeleteAlert({
      title: `¿Agregar Piso ${nextNum} al restaurante?`,
      text: `Se habilitará un nuevo nivel (Piso ${nextNum}) con su propio mapa y gestión de mesas.`,
      confirmButtonText: "Sí, configurar piso",
      cancelButtonText: "No, cancelar",
    });

    if (!result.isConfirmed) return;
    setNewFloorName(`Piso ${nextNum} - Salón`);
    setShowAddFloorForm(true);
    setShowAddTableForm(false);
  };

  const handleCreateFloorSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const nextNum = floors.length + 1;
      const prefix = String.fromCharCode(64 + Math.min(26, nextNum));
      const res = await createRestaurantFloor({
        floorName: newFloorName.trim() || `Piso ${nextNum}`,
        prefix,
      });

      const createdFloor = res.floor;
      const nextFloors = [...floors, createdFloor];
      onFloorsAndTablesChange(nextFloors, isEditMode ? draftTables : tables);
      setActiveFloorId(createdFloor.id);
      setShowAddFloorForm(false);

      await showSuccessAlert({
        title: "Nuevo piso agregado",
        text: `Se creó "${createdFloor.floorName}". Ahora puedes agregarle mesas.`,
        timer: 1800,
      });
    } catch (err) {
      showUserErrorAlert({
        title: "Error al crear piso",
        text: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Crear nueva mesa en el piso actual (por defecto A1, A2... o nombre personalizado)
  const handleCreateTableSubmit = async (e) => {
    e.preventDefault();
    if (!currentFloor) return;

    const codeToUse = (newTableName || nextSuggestedCode).trim().toUpperCase();
    try {
      setIsSaving(true);
      // Posición escalonada libre dentro del lienzo
      const count = floorTables.length;
      const col = count % 4;
      const row = Math.floor(count / 4) % 2;
      const defaultPosX = Math.min(86, 16 + col * 22);
      const defaultPosY = Math.min(82, 26 + row * 44);

      const res = await createRestaurantTable({
        floorId: currentFloor.id,
        tableCode: codeToUse,
        displayName: codeToUse,
        capacity: Number(newTableCapacity) || 4,
        shape: newTableShape,
        posX: defaultPosX,
        posY: defaultPosY,
      });

      const created = res.table;
      const updatedAll = [...(isEditMode ? draftTables : tables), created];
      if (isEditMode) {
        setDraftTables(updatedAll);
      }
      onFloorsAndTablesChange(floors, updatedAll);
      setNewTableName("");
      setShowAddTableForm(false);
    } catch (err) {
      showUserErrorAlert({
        title: "No se pudo crear la mesa",
        text: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 5. Eliminar mesa en modo edición con confirmación
  const handleDeleteTable = async (table) => {
    const occupiedInfo = occupiedTables[Number(table.tableNumber)];
    if (occupiedInfo) {
      showUserErrorAlert({
        title: `Mesa ${table.tableCode} ocupada`,
        text: `No puedes eliminar una mesa que tiene la orden #${occupiedInfo.id} activa.`,
      });
      return;
    }

    const result = await showConfirmDeleteAlert({
      title: `¿Eliminar la mesa "${table.displayName || table.tableCode}"?`,
      text: "Esta mesa se quitará del mapa del piso actual.",
      confirmButtonText: "Sí, eliminar mesa",
      cancelButtonText: "No, conservar",
    });

    if (!result.isConfirmed) return;

    try {
      setIsSaving(true);
      await deleteRestaurantTable(table.id);
      const nextList = (isEditMode ? draftTables : tables).filter(
        (t) => Number(t.id) !== Number(table.id)
      );
      if (isEditMode) {
        setDraftTables(nextList);
      }
      onFloorsAndTablesChange(floors, nextList);
    } catch (err) {
      showUserErrorAlert({
        title: "Error al eliminar mesa",
        text: err.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Arrastre táctil y con cursor (Pointer Events) dentro del mapa
  const handlePointerDownTable = (e, table) => {
    if (!isEditMode || !canvasRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggingId(table.id);

    if (e.currentTarget.setPointerCapture) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Ignorar si el navegador no soporta captura en este nodo
      }
    }
  };

  const handleCanvasPointerMove = (e) => {
    if (!isEditMode || !draggingId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.round(Math.max(8, Math.min(92, rawX)) * 10) / 10;
    const clampedY = Math.round(Math.max(16, Math.min(84, rawY)) * 10) / 10;

    setDraftTables((prev) =>
      prev.map((t) =>
        Number(t.id) === Number(draggingId)
          ? { ...t, posX: clampedX, posY: clampedY }
          : t
      )
    );
  };

  const handleCanvasPointerUp = () => {
    if (draggingId) {
      setDraggingId(null);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Barra superior del mapa: Selector de Pisos + Leyenda de estado + Barra de Edición */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Pestañas de Pisos (Piso 1, Piso 2...) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {floors.map((floor) => {
            const isActive = Number(floor.id) === Number(currentFloor?.id);
            const countInFloor = sourceTables.filter(
              (t) => Number(t.floorId) === Number(floor.id)
            ).length;

            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => setActiveFloorId(floor.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  isActive
                    ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)] shadow-sm"
                    : "bg-[var(--color-surface-darker)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text-inverse)] hover:border-[var(--color-brand)]/40"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{floor.floorName}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                    isActive
                      ? "bg-black/15 text-[var(--color-text-primary)]"
                      : "bg-white/5 text-[var(--color-text-muted)]"
                  }`}
                >
                  {countInFloor}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controles de Modo Edición o Leyenda de Estados */}
        {isEditMode ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-[var(--color-brand)] bg-[var(--color-brand)]/10 border border-[var(--color-brand)]/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Move className="w-3.5 h-3.5" />
              Modo edición: arrastra las mesas
            </span>

            <button
              type="button"
              onClick={() => {
                setNewTableName(nextSuggestedCode);
                setShowAddTableForm((v) => !v);
                setShowAddFloorForm(false);
              }}
              className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--color-surface-darker)] text-[var(--color-brand)] border border-[var(--color-brand)]/50 hover:bg-[var(--color-brand)]/15 flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar mesa ({nextSuggestedCode})
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveLayout}
              className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--color-brand)] text-[var(--color-text-primary)] hover:brightness-110 flex items-center gap-1 shadow transition cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar
            </button>

            <button
              type="button"
              onClick={handleToggleEditClick}
              className="min-h-[38px] px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--color-surface-darker)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:text-[var(--color-text-inverse)] flex items-center gap-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-surface-darker)] border border-[var(--color-brand)]/60" />
              Libre
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand)]" />
              Seleccionada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-soft)]" />
              Ocupada
            </span>
          </div>
        )}
      </div>

      {/* Formulario compacto inline para Crear Nueva Mesa */}
      {showAddTableForm && (
        <form
          onSubmit={handleCreateTableSubmit}
          className="p-3 rounded-xl bg-[var(--color-surface-darker)] border border-[var(--color-brand)]/40 flex flex-wrap items-end gap-2.5"
        >
          <div className="flex-1 min-w-[130px]">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] mb-1">
              Nombre / Código (defecto {nextSuggestedCode})
            </label>
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder={nextSuggestedCode}
              maxLength={12}
              className="w-full h-9 px-2.5 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-inverse)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          <div className="w-24">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] mb-1">
              Puestos
            </label>
            <select
              value={newTableCapacity}
              onChange={(e) => setNewTableCapacity(Number(e.target.value))}
              className="w-full h-9 px-2 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-inverse)] focus:outline-none focus:border-[var(--color-brand)]"
            >
              <option value={2}>2 sillas</option>
              <option value={4}>4 sillas</option>
              <option value={6}>6 sillas</option>
              <option value={8}>8 sillas</option>
            </select>
          </div>

          <div className="w-28">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] mb-1">
              Forma
            </label>
            <select
              value={newTableShape}
              onChange={(e) => setNewTableShape(e.target.value)}
              className="w-full h-9 px-2 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-inverse)] focus:outline-none focus:border-[var(--color-brand)]"
            >
              <option value="square">Cuadrada</option>
              <option value="rect">Rectangular</option>
              <option value="round">Redonda</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isSaving}
              className="h-9 px-3 rounded-lg bg-[var(--color-brand)] text-[var(--color-text-primary)] text-xs font-bold flex items-center gap-1 hover:brightness-110 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Crear mesa
            </button>
            <button
              type="button"
              onClick={() => setShowAddTableForm(false)}
              className="h-9 px-2.5 rounded-lg bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] text-xs font-semibold border border-[var(--color-border)] hover:text-[var(--color-text-inverse)] cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </form>
      )}

      {/* Formulario compacto inline para Agregar Segundo Piso / Nuevo Piso */}
      {showAddFloorForm && (
        <form
          onSubmit={handleCreateFloorSubmit}
          className="p-3 rounded-xl bg-[var(--color-surface-darker)] border border-[var(--color-brand)]/40 flex flex-wrap items-end gap-2.5"
        >
          <div className="flex-1 min-w-[180px]">
            <label className="block text-[11px] font-bold text-[var(--color-text-muted)] mb-1">
              Nombre del nuevo piso (ej. Piso 2 - Terraza)
            </label>
            <input
              type="text"
              value={newFloorName}
              onChange={(e) => setNewFloorName(e.target.value)}
              placeholder={`Piso ${floors.length + 1}`}
              maxLength={45}
              className="w-full h-9 px-2.5 rounded-lg bg-[var(--color-surface-dark)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-inverse)] focus:outline-none focus:border-[var(--color-brand)]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="submit"
              disabled={isSaving}
              className="h-9 px-3 rounded-lg bg-[var(--color-brand)] text-[var(--color-text-primary)] text-xs font-bold flex items-center gap-1 hover:brightness-110 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar piso
            </button>
            <button
              type="button"
              onClick={() => setShowAddFloorForm(false)}
              className="h-9 px-2.5 rounded-lg bg-[var(--color-surface-dark)] text-[var(--color-text-muted)] text-xs font-semibold border border-[var(--color-border)] hover:text-[var(--color-text-inverse)] cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Contenedor Principal: Mapa 2D del Piso + Columna lateral con Lápiz (Editar) y '+' abajo (Agregar Piso) */}
      <div className="flex items-stretch gap-2">
        {/* Lienzo 2D del restaurante (compacto para tablet: h-[195px] sm:h-[215px]) */}
        <div
          ref={canvasRef}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          style={{
            touchAction: isEditMode ? "none" : "pan-y",
            backgroundImage:
              "radial-gradient(rgba(212, 175, 55, 0.14) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
          className={`relative flex-1 h-[195px] sm:h-[215px] rounded-2xl bg-[var(--color-surface-darker)]/90 border transition-colors overflow-hidden ${
            isEditMode
              ? "border-dashed border-2 border-[var(--color-brand)] shadow-inner"
              : "border-[var(--color-border)]"
          }`}
        >
          {/* Etiqueta sutil de orientación del salón */}
          <div className="absolute top-2 left-3 pointer-events-none flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)]/60">
              {currentFloor?.floorName || "Plano del Salón"}
            </span>
          </div>

          {floorTables.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <p className="text-xs text-[var(--color-text-muted)]">
                Este piso aún no tiene mesas ubicadas.
              </p>
              {!isEditMode && (
                <p className="text-[11px] text-[var(--color-brand)] mt-1">
                  Presiona el botón del lápiz a la derecha para agregar mesas.
                </p>
              )}
            </div>
          ) : (
            floorTables.map((table) => {
              const occupiedInfo = occupiedTables[Number(table.tableNumber)];
              const isOccupied = Boolean(occupiedInfo);
              const isSelected =
                Number(selectedTableNumber) === Number(table.tableNumber);

              return (
                <TableVisualNode
                  key={table.id}
                  table={table}
                  isSelected={isSelected}
                  isOccupied={isOccupied}
                  occupiedInfo={occupiedInfo}
                  isEditMode={isEditMode}
                  isDragging={Number(draggingId) === Number(table.id)}
                  onSelect={(tbl) => onSelectTable(tbl, occupiedInfo)}
                  onPointerDown={handlePointerDownTable}
                  onDelete={handleDeleteTable}
                />
              );
            })
          )}
        </div>

        {/* Columna Lateral de Acciones Táctiles (48x48px MD3):
            1. Arriba: Botón Lápiz para Editar Mesas (con confirm)
            2. Abajo del lápiz: Botón '+' para Agregar Segundo Piso / Nuevo Nivel */}
        <div className="flex flex-col items-center justify-start gap-2">
          <IconButton
            icon={Pencil}
            label="Editar distribución de mesas"
            onClick={handleToggleEditClick}
            className={`min-w-[48px] min-h-[48px] rounded-xl border transition shadow-sm ${
              isEditMode
                ? "bg-[var(--color-brand)] text-[var(--color-text-primary)] border-[var(--color-brand)]"
                : "bg-[var(--color-surface-darker)] text-[var(--color-brand)] border-[var(--color-brand)]/40 hover:bg-[var(--color-brand)]/15"
            }`}
          />

          <IconButton
            icon={Plus}
            label="Agregar nuevo piso al restaurante"
            onClick={handleOpenAddFloor}
            className="min-w-[48px] min-h-[48px] rounded-xl bg-[var(--color-surface-darker)] text-[var(--color-text-inverse)] border border-[var(--color-border)] hover:border-[var(--color-brand)]/60 hover:text-[var(--color-brand)] transition shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
