import { pool } from "../../config/db.js";

const getAllGroups = async () => {
    const result = await pool.query(
        "SELECT group_id, group_name, is_active FROM groups ORDER BY group_id ASC"
    );
    return result.rows;
    };

    const getGroupPermissions = async (groupId) => {
    const result = await pool.query(
        `SELECT p.permission_id, p.permission_name, p.permission_codename
        FROM permissions p
        INNER JOIN group_permissions gp ON gp.permission_id = p.permission_id
        WHERE gp.group_id = $1`,
        [groupId]
    );
    return result.rows;
    };

    const updateGroupPermissions = async (groupId, permissionIds) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query("DELETE FROM group_permissions WHERE group_id = $1", [groupId]);

        for (const permissionId of permissionIds) {
        await client.query(
            "INSERT INTO group_permissions (group_id, permission_id) VALUES ($1, $2)",
            [groupId, permissionId]
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

export default { getAllGroups, getGroupPermissions, updateGroupPermissions };