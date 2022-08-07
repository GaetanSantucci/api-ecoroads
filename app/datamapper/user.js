//~ IMPORTATIONS DES MODULES
import pool from "../service/dbClient.js";

const TABLE_NAME = "user";

// ~ *** *** FIND ALL USERS *** *** ~ //
// ~ ****************************** ~ //
async function findAll() {
    const result = await pool.query(
        `SELECT * FROM public."${TABLE_NAME}" ORDER BY created_at DESC;`,
    );
    return result.rows;
}

// ~ *** *** FIND ONE USER *** *** ~ //
// ~ ***************************** ~ //

async function findOne(userData, columnName) {
    const queryPrepared = {
        text: `SELECT * FROM public."${TABLE_NAME}" WHERE "${columnName}" = $1;`,
        values: [userData],
    };
    const result = await pool.query(queryPrepared);

    return result;
}

// ~ *** *** FIND ONE USER PROFILE PAGE *** *** ~ //
// ~ ****************************************** ~ //

async function findOneUserProfile(userData, columnName) {
    const queryPrepared = {
        text: `SELECT public.user.id, public.user.username, public.user.email,
        (SELECT json_build_object('brand_id', public.brand.id, 'name', public.brand.name, 'car_id', public.car.id ,'model', public.car.model, 'image', public.car.image) 
        FROM public."user" 
        JOIN public.car ON public.car.id = public."user".car_id 
        JOIN public.brand ON public.brand.id = public.car.brand_id
        WHERE public."user".${columnName} = $1)  AS "car",
        (SELECT 
        json_build_object(
        'label', public.location.label,
        'address', public.location.address, 
        'street_number', public.location.street_number, 
        'zipcode', public.location.zipcode, 
        'city', public.location.city,
        'Lat', public.location.lat,
        'Long', public.location.lon) AS location 
        FROM public."location"
        JOIN public."user" ON public."user".location_id = public.location.id 
        WHERE public."user".${columnName} = $1),
        (SELECT
        JSON_AGG(json_build_object ('category', public."category".name,'id', public."category".id)) 
        AS "categories" 
        FROM public.user_like_category 
        JOIN public.category ON public.category.id = public.user_like_category.category_id
        JOIN public."user" ON public."user".id = public.user_like_category.user_id 
        WHERE public."user".${columnName} = $1
        GROUP BY public.user.username) 
        FROM public."${TABLE_NAME}" 
        WHERE public."user".${columnName}= $1;`,
        values: [userData],
    };

    const result = await pool.query(queryPrepared);

    return result;
}

// ~ *** *** CREATE USER *** *** ~ //
// ~ *************************** ~ //

async function createData(userData) {
    let { email, password, username, location, car_id, categories } = userData;

    if (isNaN(location) && location !== undefined) {
        const queryPreparedLocation = {
            text: `INSERT INTO public."location"("address", "street_number","zipcode", "city", "lat", "lon")
                    VALUES ($1, $2, $3, $4, $5, $6);`,
            values: [
                location.address,
                location.street_number,
                location.zipcode,
                location.city,
                location.Lat,
                location.Long,
            ],
        };
        await pool.query(queryPreparedLocation);

        const locationCreatedID = await pool.query(
            `SELECT location.id FROM "location" WHERE lat = ${location.Lat} AND lon = ${location.Long};`,
        );

        const queryPreparedUser = {
            text: `INSERT INTO public."${TABLE_NAME}"
                        ("email","password","username",location_id, "car_id")
                        VALUES
                        ($1,$2,$3,$4,$5);`,
            values: [email, password, username, locationCreatedID.rows[0].id, car_id],
        };
        await pool.query(queryPreparedUser);
    } else {
        const queryPrepared = {
            text: `INSERT INTO "${TABLE_NAME}"
                ("email","password","username",location_id, "car_id")
                VALUES
                ($1,$2,$3,$4,$5);`,
            values: [email, password, username, location, car_id],
        };
        await pool.query(queryPrepared);
    }
    const userId = await findOne(email, "email");

    if (categories !== undefined) {
        for (const category of categories) {
            await pool.query(`INSERT INTO public.user_like_category(
            category_id, user_id)
            VALUES ( ${category}, '${userId.rows[0].id}');`);
        }
    }
}

// ~ *** *** UPDATE USER *** *** ~ //
// ~ *************************** ~ //

async function updateData(userId, userData) {
    const { email, password, username, location, car_id } = userData;

    const sql = {
        text: `
            UPDATE "${TABLE_NAME}"
                SET
                "email" = COALESCE(( $1 )::EMAIL, email),
                "password" = COALESCE(( $2 )::TEXT, password),
                "username" = COALESCE(( $3 )::TEXT, username),
                "location_id" = COALESCE(( $4 )::INT, "location_id"),
                "car_id" = COALESCE (( $5 )::INT, "car_id"),
                "updated_at" = NOW()
            WHERE "id" = $6;`,
        values: [email, password, username, location, car_id, userId],
    };
    const result = await pool.query(sql);
    return result.rowCount;
}

//~----------------------------------------------------------DELETE CAR

async function deleteData(userId) {
    const result = await pool.query(`DELETE FROM "${TABLE_NAME}" WHERE "id" = $1 ;`, [userId]);
    return result.rowCount;
}

export { findAll, findOne, findOneUserProfile, createData, updateData, deleteData };
