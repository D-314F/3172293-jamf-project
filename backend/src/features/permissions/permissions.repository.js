import { pool } from "../../config/db.js";

const getAllPermissions = async () => {
    const result = await pool.query(`
        SELECT
        p.permission_id,
        p.permission_name,  
        p.permission_codename,
        ct.content_type_id,
        ct.app_label,
        ct.model,
        ct.display_name
        FROM permissions p
        INNER JOIN content_type ct ON ct.content_type_id = p.content_type_id
        ORDER BY ct.content_type_id, p.permission_id ASC
    `);
    return result.rows;
    };

    const getUserPermissions = async (userId) => {
    const result = await pool.query(
        `SELECT p.permission_id, p.permission_name, p.permission_codename
        FROM permissions p
        INNER JOIN user_permissions up ON up.permission_id = p.permission_id
        WHERE up.user_id = $1`,
        [userId]
    );
    return result.rows;
    };

    const updateUserPermissions = async (userId, permissionIds) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM user_permissions WHERE user_id = $1", [userId]);

        for (const permissionId of permissionIds) {
        await client.query(
            "INSERT INTO user_permissions (user_id, permission_id) VALUES ($1, $2)",
            [userId, permissionId]
        );
        }

        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};

export default { getAllPermissions, getUserPermissions, updateUserPermissions };