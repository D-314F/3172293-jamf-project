import StatusSwitch from "@/shared/components/StatusSwitch";
import { updateUser } from "../services/userServices";

export default function UserStatusCell({ user, canEdit = true }) {
  const realStatus = Boolean(user.isActive ?? user.is_active);

  const handleChange = async (value) => {
    await updateUser(user.id, { isActive: value });

    window.dispatchEvent(
      new CustomEvent("jamf:user-status-updated", {
        detail: { id: user.id, isActive: value },
      })
    );
  };

  return (
    <StatusSwitch
      checked={realStatus}
      disabled={!canEdit}
      onChange={handleChange}
      itemName={`al usuario "${user.userName}"`}
    />
  );
}
