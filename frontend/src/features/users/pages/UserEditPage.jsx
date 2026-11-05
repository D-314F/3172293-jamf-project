import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserEditContent from "../components/UserEditContent";
import { getUserById, updateUser } from "../services/userServices";
import documentTypes from "../../../data/selects/documentsTypes.json";
import userTypes from "../../../data/selects/userTypes.json";

export default function UserEditPage() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userBusinessEmail: "",
    userAddress: "",
    userStartDate: "",
    userEndDate: "",
    userDocumentTypes: "",
    userType: "",
    userDocumentNumber: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);

        // Normalizar código (ej. "CC") al label del Select ("Cédula de ciudadania")
        const matchedDoc = documentTypes.find(
          (d) => d.id === data.userDocumentTypes || d.label === data.userDocumentTypes
        );
        const matchedType = userTypes.find(
          (t) => t.id === data.userType || t.label === data.userType
        );

        setFormData({
          userName: data?.userName || data?.fullName || "",
          userEmail: data?.userEmail || data?.email || "",
          userPhone: data?.userPhone || data?.phone || "",
          userBusinessEmail: data?.userBusinessEmail || data?.businessEmail || "",
          userAddress: data?.userAddress || data?.address || "",
          userStartDate: data?.userStartDate || data?.startDate || "",
          userEndDate: data?.userEndDate || data?.endDate || "",
          userDocumentTypes: matchedDoc ? matchedDoc.label : data?.userDocumentTypes || "",
          userType: matchedType ? matchedType.label : data?.userType || "",
          userDocumentNumber: data?.userDocumentNumber || data?.documentNumber || "",
          isActive: data?.isActive ?? true,
        });
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUserData();
    }
  }, [id]);

  const handleSubmit = async (updatedData) => {
    await updateUser(id, updatedData);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[var(--color-text-inverse)]">
        Cargando datos del usuario...
      </div>
    );
  }

  return (
    <UserEditContent
      formData={formData}
      setFormData={setFormData}
      user={user}
      onSubmit={handleSubmit}
    />
  );
}