
class Filter {
    constructor(column, processFunction = null) {
      this.column = column;
      this.process = processFunction || ((value) => value); // Default process is an identity function
    }
  
    apply(value) {
      return this.process(value);
    }
}

const filters = {
    //title: new Filter('title', value => value.trim()), exapmle
    pid: new Filter('pid', value => value * 1),
    uid: new Filter('uid'),
    post_type: new Filter('post_type'),
    cid: new Filter('cid'),
    //location: new Filter('location'),
    expiration_time: new Filter('expiration_time'),
};

export const create_post_retreival_query = async (queryParams) => {
	let baseQuery = `SELECT * FROM posts`;
    const whereClauses = [];
    const values = [];
    if (queryParams.lat && queryParams.lng) {
        baseQuery = `SELECT *, ST_Distance(
          ST_SetSRID(location::geometry, 4326),
          ST_SetSRID(ST_MakePoint($1, $2), 4326)
        ) AS distance
        FROM posts;
        `;
        values.push(queryParams.lat);
        values.push(queryParams.lng);
    }

    Object.entries(queryParams).forEach(([key, value]) => {
        const filter = filters[key];
        if (filter && value) {
        const processedValue = filter.apply(value);
        whereClauses.push(`${filter.column} = $${values.length + 1}`);
        //whereClauses.push(`${filter.column} = $${whereClauses.length + 1}`);
        values.push(processedValue);
        }
    });

	let orderBy = 'expiration_time';
    const query = whereClauses.length ? `${baseQuery} WHERE ${whereClauses.join(' AND ')} ORDER BY ${orderBy}` : baseQuery;
	
    return [query, values];
};