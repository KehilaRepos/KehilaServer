import dbService from "./dbService.js";

export const create_notification_service = async (user_email, type, pid) => {
    try {     
        if(!user_email || !type || !pid) {
            throw new Error('Missing required fields');
        }
        const query = `INSERT INTO notifications (user_email, type, pid, creation_time) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`;
        const values = [user_email, type, pid];
        await dbService.instance.pool.query(query, values);
    }
    catch (error) {
        throw error;
    }
}

export const get_notification_service = async (query_params) => {
    let values = [];
    const user_email = query_params.user_email;
    const type = query_params.type;
    if (!user_email) {
        throw new Error('No user email provided');
    }
    let query = `SELECT * FROM notifications WHERE user_email = $1`;
    values.push(user_email);
    if (type) {
        query += ` AND type = $2`;
        values.push(type);
    }
    query += ` ORDER BY creation_time DESC`;
    const response = await dbService.instance.pool.query(query, values);
    return response.rows;
}

