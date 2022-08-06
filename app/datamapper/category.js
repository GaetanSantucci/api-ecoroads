import pool from "../service/dbClient.js";

const TABLE_NAME = "category";

//~ ------------------------------------------------------------------- FIND ALL CATEGORIES

async function findAll() {
    const result = await pool.query(`SELECT category.id, category.name FROM "${TABLE_NAME}";`);

    return result.rows;
}

//~---------------------------------------------------------------------FIND ONE CATEGORY

async function findOne(categoryId) {
    const result = await pool.query(`SELECT * FROM "${TABLE_NAME}" WHERE "id" = $1;`, [categoryId]);

    return result.rows[0];
}

async function findCategoryByUser(userId) {
    const queryPrepared = {
        text: `SELECT category_id FROM public.user_like_category WHERE user_id = $1;`,
        values: [userId],
    };
    const result = await pool.query(queryPrepared);
    return result;
}

async function findCategory(categories) {
    const result = await pool.query(`SELECT category.id, category.name FROM category AS c  WHERE c.id IN ($1, $2, $3);`, [categories[0], categories[1], categories[2]])
    return result.rows
}


async function updateData(categories, userId) {

    const findUserCategories = await pool.query(`SELECT category_id FROM public.user_like_category WHERE user_id = $1;`, [userId])

    if (findUserCategories.rowCount !== 0) await pool.query(`DELETE FROM public.user_like_category WHERE user_id = $1;`, [userId]);

    for await (const category of categories) {
        pool.query(`INSERT INTO public.user_like_category
                (category_id, user_id)
                    VALUES ( ${category}, '${userId}');`);
    }
}

export { findAll, findOne, findCategory, findCategoryByUser, updateData };
