import dbService from "./dbService.js";
export const get_zones_service = () => { 
    const zones = [
        {
            id: 1, 
            name: 'Northern District',
            coordinates: {
                latitude: 32.843473,
                longitude: 35.472021
            }
        },
        {
            id: 2, 
            name: 'Haifa District',
            coordinates: {
                latitude: 32.794044,
                longitude: 34.989571
            }
        },
        {
            id: 3, 
            name: 'Central District',
            coordinates: {
                latitude: 32.084482, 
                longitude: 34.884464
            }
        },
        {
            id: 4, 
            name: 'Tel Aviv District',
            coordinates: {
                latitude: 32.085300,
                longitude: 34.781769
            }
        },
        {
            id: 5, 
            name: 'Jerusalem District',
            coordinates: {
                latitude: 31.768319,
                longitude: 35.213710
            }
        },
        {
            id: 6, 
            name: 'Southern District',
            coordinates: {
                latitude: 31.242877,
                longitude: 34.798139
            }
        }     
    ]
    return zones;
}

export const get_availability_service = () => { 
    const availability = [
        {
            id: 1, 
            name: 'Everyday'
        },
        {
            id: 2, 
            name: 'Weekends and holidays'
        },
        {
            id: 3, 
            name: 'Holidays only'
        },
        {
            id: 4,
            name: 'Weekends only'
        },
        {
            id: 5,
            name: 'Other'
        }
    ]
    return availability;
}

export const register_to_newsletter_service = async (body) => {
    try {

        // todo - validate phone number using validator library
        
        const { phone, cid, availability, charity_zone, full_name } = body;
        if (!phone || !cid || !availability || !charity_zone || !full_name) {
            throw new Error('Missing required fields');
        }
        const query = `INSERT INTO newsletter (phone, cid, availability, charity_zone, full_name, creation_date) 
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`;

        const queryValues = [phone, cid, availability, charity_zone, full_name];

        await dbService.instance.pool.query(query, queryValues);

    } catch (error) {
        throw error;
    }
}

export const delete_newsletter_registration_service = async (body) => {
    try {
        const { phone, cid } = body;
    if (!phone || !cid) {
        throw new Error('Missing required fields');
    }
    const query = `DELETE FROM newsletter WHERE phone = $1 AND cid = $2`;
    const queryValues = [phone, cid];
    await dbService.instance.pool.query(query, queryValues);
    } catch (error) {
        throw error;
    }
}

export const get_newsletter_service = async (queryParams) => {
    try {
        //const { phone, cid } = query;
        const phone = queryParams.phone;
        const cid = queryParams.cid;
        let queryValues = [];
        let query = `SELECT * FROM newsletter`;
        if (phone && cid) {
            query += ` WHERE phone = $1 AND cid = $2`;
            queryValues = [phone, cid];
        }
        const result = await dbService.instance.pool.query(query, queryValues);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

