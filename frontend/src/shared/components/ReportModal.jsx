// src/shared/components/ReportModal.jsx
import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Checkbox from "./Checkbox";
import {
	showSuccessAlert,
	showCancelAlert,
	showUserErrorAlert,
} from "@/shared/services/alertService";

export default function ReportModal({
	isOpen,
	onClose,
	title,
	fields = [],
	formatOptions = [],
	scopeOptions = [],
	filterConfigMap = {},
	onGenerate,
	successTitle,
}) {
	const [format, setFormat] = useState(formatOptions[0]?.value || "pdf");
	const [scope, setScope] = useState(scopeOptions[0]?.value || "all");
	const [filterValue, setFilterValue] = useState("");
	const [loading, setLoading] = useState(false);

	const [selectedFields, setSelectedFields] = useState(() =>
		fields.filter((field) => field.default !== false)
	);

	if (!isOpen) return null;

	const activeFilterConfig = filterConfigMap[scope] || null;

	const handleFieldToggle = (field) => {
		const exists = selectedFields.some((f) => f.key === field.key);
		setSelectedFields(
			exists
				? selectedFields.filter((f) => f.key !== field.key)
				: [...selectedFields, field]
		);
	};

	const handleSelectAll = () => {
		if (selectedFields.length === fields.length) {
			setSelectedFields([]);
		} else {
			setSelectedFields([...fields]);
		}
	};

	const handleGenerateReport = async () => {
		if (selectedFields.length === 0) {
			await showUserErrorAlert({
				title: "Campos requeridos",
				text: "Debes seleccionar al menos un campo para incluir en el reporte.",
			});
			return;
		}

		if (activeFilterConfig && !filterValue.trim()) {
			await showUserErrorAlert({
				title: "Filtro requerido",
				text:
					activeFilterConfig.emptyError ||
					"Por favor ingresa el valor del filtro seleccionado.",
			});
			return;
		}

		setLoading(true);

		try {
			const result = await onGenerate({
				format,
				selectedFields,
				scope,
				filterValue,
			});

			if (result !== false) {
				await showSuccessAlert({
					title: successTitle,
					text: `El archivo en formato ${format.toUpperCase()} se generó correctamente.`,
					timer: 2000,
				});
				onClose();
			}
		} catch (error) {
			console.error("Error al generar reporte:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = async () => {
		const result = await showCancelAlert({
			title: "¿Deseas cancelar?",
			text: "Se descartará la configuración seleccionada.",
			timer: 2500,
		});

		if (result.isConfirmed) {
			onClose();
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={handleCancel} title={title}>
			{/* Selección de Formato */}
			<div>
				<Select
					label="Formato del reporte"
					name="reportFormat"
					value={format}
					onChange={(e) => setFormat(e.target.value)}
					options={formatOptions}
				/>
			</div>

			{/* Selección de Campos */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium text-[var(--color-text-inverse)]">
						Campos a incluir:
					</span>
					<button
						type="button"
						onClick={handleSelectAll}
						className="text-xs text-[var(--color-brand)] hover:underline font-medium cursor-pointer"
					>
						{selectedFields.length === fields.length
							? "Deseleccionar todos"
							: "Marcar todos"}
					</button>
				</div>

				<div className="grid grid-cols-2 gap-3 bg-[var(--color-surface)]/10 p-4 rounded-xl border border-[var(--color-brand)]/30 max-h-40 overflow-y-auto">
					{fields.map((field) => (
						<Checkbox
							key={field.key}
							id={`field-${field.key}`}
							name={field.key}
							label={field.label}
							checked={selectedFields.some((f) => f.key === field.key)}
							onChange={() => handleFieldToggle(field)}
						/>
					))}
				</div>
			</div>

			{/* Selección de Alcance */}
			<div className="space-y-3">
				<Select
					label="Alcance del reporte"
					name="reportScope"
					value={scope}
					onChange={(e) => {
						setScope(e.target.value);
						setFilterValue("");
					}}
					options={scopeOptions}
				/>

				{activeFilterConfig && (
					<Input
						label={activeFilterConfig.label}
						name="filterValue"
						value={filterValue}
						onChange={(e) => setFilterValue(e.target.value)}
						placeholder={activeFilterConfig.placeholder}
						className="h-10"
					/>
				)}
			</div>

			{/* Botones de Acción */}
			<div className="pt-4 flex flex-col sm:flex-row justify-end gap-3">
				<Button
					type="button"
					variant="secondary"
					onClick={handleCancel}
					disabled={loading}
					className="w-full sm:w-auto"
				>
					Cancelar
				</Button>

				<Button
					type="button"
					variant="primary"
					onClick={handleGenerateReport}
					disabled={loading}
					className="w-full sm:w-auto"
				>
					{loading ? "Generando..." : "Descargar reporte"}
				</Button>
			</div>
		</Modal>
	);
}