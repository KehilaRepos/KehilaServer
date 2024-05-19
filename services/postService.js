
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
    location: new Filter('location'),
    expiration_time: new Filter('expiration_time'),
};

export const create_post_query = async (queryParams) => {
    const baseQuery = 'SELECT * FROM posts';
    const whereClauses = [];
    const values = [];

    Object.entries(queryParams).forEach(([key, value]) => {
        const filter = filters[key];
        if (filter && value) {
        const processedValue = filter.apply(value);
        whereClauses.push(`${filter.column} = $${whereClauses.length + 1}`);
        values.push(processedValue);
        }
    });
    const query = whereClauses.length ? `${baseQuery} WHERE ${whereClauses.join(' AND ')}` : baseQuery;
    return [query, values];
};