import dbService from "./dbService.js";

export const get_categories_service = async (queryParams) => {
    try {
        let query = 'SELECT * FROM categories';
        if(queryParams.orderby === 'title') {
            query = query + ' ORDER BY category_name';
        }
    
        const categories = await dbService.instance.pool.query(query, []);
    
        return categories.rows;
    } catch (error) {
        throw(error);
    }

}