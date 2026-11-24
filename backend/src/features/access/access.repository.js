import { pool } from "../../config/db.js";

/**
 * Evalúa los permisos efectivos de un usuario:
 * 1) Si tiene registros explícitos en `user_permissions`, esos permisos individuales mandan
 *    (permite personalizar o quitar permisos a un usuario específico desde PermissionForm).
 * 2) Si no tiene registros en `user_permissions`, hereda los permisos de su grupo (`user_groups` o `groups` por `user_type`).
 * 3) Como respaldo de seguridad, si es `is_superuser = true` y su grupo aún no tiene permisos configurados en BD,
 *    tiene acceso total para no dejar bloqueado un entorno recién instalado.
 */
const getUserEffectivePermissions = async (userId) => {
  const individualRes = await pool.query(
    `SELECT p.permission_id, p.permission_name, p.permission_codename
     FROM user_permissions up
     INNER JOIN permissions p ON p.permission_id = up.permission_id
     WHERE up.user_id = $1`,
    [userId]
  );

  if (individualRes.rowCount > 0) {
    return individualRes.rows;
  }

  const groupRes = await pool.query(
    `SELECT DISTINCT p.permission_id, p.permission_name, p.permission_codename
     FROM permissions p
     WHERE p.permission_id IN (
       SELECT gp.permission_id
       FROM user_groups ug
       INNER JOIN group_permissions gp ON gp.group_id = ug.group_id
       WHERE ug.user_id = $1

       UNION

       SELECT gp.permission_id
       FROM users u
       INNER JOIN groups g ON LOWER(g.group_name) = LOWER(u.user_type)
       INNER JOIN group_permissions gp ON gp.group_id = g.group_id
       WHERE u.id = $1
     )`,
    [userId]
  );

  if (groupRes.rowCount > 0) {
    return groupRes.rows;
  }

  const superRes = await pool.query(
    "SELECT is_superuser FROM users WHERE id = $1",
    [userId]
  );
  if (superRes.rows[0]?.is_superuser === true) {
    const allRes = await pool.query(
      "SELECT permission_id, permission_name, permission_codename FROM permissions"
    );
    return allRes.rows;
  }

  return [];
};

const userHasPermission = async (userId, permissionCode) => {
  const effectivePermissions = await getUserEffectivePermissions(userId);
  return effectivePermissions.some(
    (p) => p.permission_codename === permissionCode
  );
};

export default { getUserEffectivePermissions, userHasPermission };
