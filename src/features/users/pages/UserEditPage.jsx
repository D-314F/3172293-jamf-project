import { useState } from "react";
import UserEditContent from "../components/UserEditContent";

export default function UserEditPage({ user = {} }) {
  const [formData, setFormData] = useState({
    userName: user?.userName || user?.fullName || "",
    userEmail: user?.userEmail || user?.email || "",
    userPhone: user?.userPhone || user?.phone || "",
    userBusinessEmail: user?.userBusinessEmail || user?.businessEmail || "",
    userAddress: user?.userAddress || user?.address || "",
    userStartDate: user?.userStartDate || user?.startDate || "",
    userEndDate: user?.userEndDate || user?.endDate || "",
    userDocumentTypes: user?.userDocumentTypes || "",
    userType: user?.userType || "",
    userDocumentNumber: user?.userDocumentNumber || user?.documentNumber || "",
    isActive: user?.isActive ?? true,
  });

  return (
    <UserEditContent
      formData={formData}
      setFormData={setFormData}
      user={user}
    />
  );
}