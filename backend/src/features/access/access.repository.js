import { pool } from "../../config/db.js";

const isSuperUser = async (userId) => {
    const result = await pool.query(
        "SELECT is_superuser, user_type FROM users WHERE id = $1",
        [userId]
    );
    const user = result.rows[0];
    if (!user) return false;
    return (
        user.is_superuser === true ||
        (user.user_type && user.user_type.toLowerCase() === "administrador")
    );
    };

    const userHasPermission = async (userId, permissionCode) => {
    const query = `
        SELECT 1 FROM (
        SELECT p.permission_codename
        FROM user_permissions up
        INNER JOIN permissions p ON p.permission_id = up.permission_id
        WHERE up.user_id = $1

        UNION

        SELECT p.permission_codename
        FROM user_groups ug
        INNER JOIN group_permissions gp ON gp.group_id = ug.group_id
        INNER JOIN permissions p ON p.permission_id = gp.permission_id
        WHERE ug.user_id = $1

        UNION

        SELECT p.permission_codename
        FROM users u
        INNER JOIN groups g ON LOWER(g.group_name) = LOWER(u.user_type)
        INNER JOIN group_permissions gp ON gp.group_id = g.group_id
        INNER JOIN permissions p ON p.permission_id = gp.permission_id
        WHERE u.id = $1
        ) AS user_perms
        WHERE permission_codename = $2
        LIMIT 1
    `;

    const result = await pool.query(query, [userId, permissionCode]);
    return result.rowCount > 0;
};

export default { isSuperUser, userHasPermission };