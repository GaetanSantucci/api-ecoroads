import pool from "../service/dbClient.js";

const TABLE_NAME = "road";

//~ ------------------------------------------------------------------- FIND ALL ROADS

async function findAll(userId) {
    const result = await pool.query(
        `SELECT road.id, generated_road, favorite FROM ${TABLE_NAME}  WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5`,
        [userId]
    );

    return result.rows;
}

//~---------------------------------------------------------------------FIND ONE ROAD

async function findOne(roadId) {
    const result = await pool.query(
        `SELECT road.id, generated_road FROM ${TABLE_NAME} JOIN user ON user.id = road.user_id WHERE road.id = $1`,
        [roadId],
    );

    return result.rows[0];
}

//~---------------------------------------------------------------------CREATE ROAD

async function createData(userId, road ) {

    const sql = {
        text: `INSERT INTO "${TABLE_NAME}"
            ("user_id", "generated_road")
            VALUES
            ($1, $2);`,
        values: [userId, road],
    };

    const result = await pool.query(sql);

    return result.rowCount;
}

//~----------------------------------------------------------------------UPDATE ROAD

async function updateData(roadId, roadData) {
    const { generated_road, user_id } = roadData;

    const sql = {
        text: `
            UPDATE "${TABLE_NAME}"
                SET
                "generated_road" = $1,
                "user_id" = $2
            WHERE "id" = $3;`,
        values: [generated_road, user_id, roadId],
    };

    const result = await pool.query(sql);

    return result.rowCount;
}

//~----------------------------------------------------------DELETE ROAD

async function deleteData(roadId) {
    const result = await pool.query(`DELETE FROM "${TABLE_NAME}" WHERE "id" = $1;`, [roadId]);

    return result.rowCount;
}

export { findAll, findOne, createData, updateData, deleteData };