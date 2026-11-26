//Layouts
export { default as AuthLayout } from './layouts/AuthLayout';
export { default as DashboardLayout } from './layouts/DashboardLayout';

// Componentes
export { default as Input } from './components/Input';
export { default as Button } from './components/Button';
export { default as Card } from './components/Card';

export { default as Select } from './components/Select';
export { default as Checkbox } from './components/Checkbox';

export { IconButton } from "./components/IconButton";
export { default as StatusSwitch } from "./components/StatusSwitch";
export { default as DataTable } from "./components/DataTable";
export {
  Dropdown,
  DropdownTrigger,
  DropdownItem,
  DropdownContent,
} from "./components/Dropdown";
export { default as FileInput } from "./components/FileInput";
export { default as DetailItem } from "./components/DetailItem";
export { default as Modal } from "./components/Modal";
export { default as ReportModal } from "./components/ReportModal";

// Contextos y servicios compartidos
export { ThemeProvider } from "./context/ThemeContext";
export { useTheme } from "./context/useTheme";
export {
  BACKEND_ORIGIN,
  resolveMediaUrl,
  uploadImage,
  resolveUploadedImageUrl,
} from "./services/uploadService";

// layouts components
export { default as Navbar } from "./layouts/Navbar";
