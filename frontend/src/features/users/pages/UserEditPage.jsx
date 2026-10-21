import { useState } from "react";
import UserEditContent from "../components/UserEditContent";

export default function UserEditPage({ user = {}, onSubmit }) {
  const getInitialFormData = (data) => ({
    userName: data?.userName || data?.fullName || "",
    userEmail: data?.userEmail || data?.email || "",
    userPhone: data?.userPhone || data?.phone || "",
    userBusinessEmail: data?.userBusinessEmail || data?.businessEmail || "",
    userAddress: data?.userAddress || data?.address || "",
    userStartDate: data?.userStartDate || data?.startDate || "",
    userEndDate: data?.userEndDate || data?.endDate || "",
    userDocumentTypes: data?.userDocumentTypes || "",
    userType: data?.userType || "",
    userDocumentNumber: data?.userDocumentNumber || data?.documentNumber || "",
    isActive: data?.isActive ?? true,
  });

  const [formData, setFormData] = useState(() => getInitialFormData(user));

  return (
    <UserEditContent
      formData={formData}
      setFormData={setFormData}
      user={user}
      onSubmit={onSubmit}
    />
  );
}