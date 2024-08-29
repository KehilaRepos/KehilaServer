import dbService from "./dbService.js";
import { S3Client, PutObjectCommand, DeleteObjectCommand  } from "@aws-sdk/client-s3";
import fs from 'fs';
import { unlink } from 'fs/promises';

const s3 = new S3Client({ // Create a new S3 client
	region: "us-east-1",
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		sessionToken: process.env.AWS_SESSION_TOKEN
	}
});

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
    cid: new Filter('cid'),
	day: new Filter('day', value => {
		let date = new Date();
		date.setDate(date.getDate() + parseInt(value));
		return date;
	}),
    //location: new Filter('location'),
};

export const create_post_retreival_query = async (queryParams) => {
	try {
		let baseQuery = `SELECT * FROM posts`;
		const whereClauses = [];
		const values = [];
		let orderBy = 'expiration_time';
		if (queryParams.lat && queryParams.lng && queryParams.radius) {
			// baseQuery = `
			// 	SELECT * FROM (
			// 		SELECT *, ST_Distance(
			// 			ST_SetSRID(location::geometry, 4326),
			// 			ST_SetSRID(ST_MakePoint($1, $2), 4326)
			// 		) AS distance
			// 		FROM posts
			// 	) AS subquery
			// 	WHERE distance < $3
			// `;
			let radius = queryParams.radius * 1000;
			baseQuery = `
				SELECT * FROM (
					SELECT *, ST_Distance(
						ST_SetSRID(ST_MakePoint(location[0], location[1]), 4326)::geography,
						ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
					) AS distance
					FROM posts
				) AS subquery
			`
			
			values.push(queryParams.lat);
			values.push(queryParams.lng);
			whereClauses.push(`distance < $${values.length + 1}`);
			values.push(radius);
			orderBy = 'distance';
		}

		Object.entries(queryParams).forEach(([key, value]) => {
			const filter = filters[key];
			if (filter && value) {
				const processedValue = filter.apply(value);
				if (filter.column === 'day') { // Special case for day filter
					whereClauses.push(`expiration_time < $${values.length + 1} AND expiration_time > CURRENT_TIMESTAMP`);
				}
				else {
					whereClauses.push(`${filter.column} = $${values.length + 1}`);
				}
				//whereClauses.push(`${filter.column} = $${whereClauses.length + 1}`);
				values.push(processedValue);
			}
		});

		let query = whereClauses.length ? `${baseQuery} WHERE ${whereClauses.join(' AND ')}` : baseQuery;
		query += ` ORDER BY ${orderBy}`;
		let response = await dbService.instance.pool.query(query, values);
		response = response.rows;
		if (queryParams.lat && queryParams.lng && queryParams.radius) {
			for (let post of response) {
				post.distance = post.distance / 1000;
			}
		}
		return response;

	} catch (error) {
		throw(error);
	}
};


const upload_post_to_db = async (req, has_image) => {
	try {
		const data = {
			email: req.body.user_email,
			cid: req.body.cid,
			title: req.body.title,
			description: req.body.description,
			latitude: req.body.lat,
			longitude: req.body.lng,
			expiration_time: req.body.expiration_time,
			target: req.body.target,
			contact_name: req.body.contact_name,
			contact_phone: req.body.contact_phone,
			contact_email: req.body.contact_email,
			facebook: req.body.facebook,
			instagram: req.body.instagram,
			twitter: req.body.twitter,
			website: req.body.website
		};
		if (!data.email || !data.cid || !data.title) {
			throw new Error('Missing required fields');
		}
		
		for (let value in data) {
			if (!data[value]) {
				data[value] = null;
			}
		}
		const query = `INSERT INTO posts (user_email, cid, title, description, location, expiration_time, target, contact_name, contact_phone, contact_email, facebook, instagram, twitter, website, has_image, creation_time) VALUES ($1, $2, $3, $4, Point($5, $6), $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP) RETURNING pid`;
		const queryValues = [data.email, data.cid, data.title, data.description, data.latitude, data.longitude, data.expiration_time, data.target, data.contact_name, data.contact_phone, data.contact_email, data.facebook, data.instagram, data.twitter, data.website, has_image];

		const queryResponse = await dbService.instance.pool.query(query, queryValues);

		return queryResponse.rows[0].pid;
	} catch (error) {
		throw error;
	}
}

const upload_to_s3 = async (file, pid) => {
	try {
		
		const fileStream = fs.createReadStream(file.path);
		const input = {
            Bucket: 'kehilabucket',
            Key: `${pid}`,
            Body: fileStream
        };

		const command = new PutObjectCommand(input);
		await s3.send(command);
		await unlink(file.path);
	} catch (error) {
		console.log(error);
		throw error;
	}
}


export const create_post_service = async (req) => {

	try {

		let has_image = false;	
		if (req.file) {
			has_image = true;
		}

		const pid = await upload_post_to_db(req, has_image);

		if (req.file) {
			await upload_to_s3(req.file, pid);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

const delete_from_s3 = async (pid) => {
	try {
		const input = {
            Bucket: 'kehilaimagebucket',
            Key: `${pid}`
        };
		const command = new DeleteObjectCommand(input);
		await s3.send(command);
	} catch (error) {
		throw error;
	}
}

export const delete_post_service = async (pid) => {
	try {
		const query = `DELETE FROM posts WHERE pid = $1 RETURNING has_image`;
		const query_values = [pid];
		console.log(query_values);
		const response = await dbService.instance.pool.query(query, query_values);
		
		if (response.rowCount === 0) {
			throw new Error('Post not found');
		}
		const has_image = response.rows[0].has_image;
		if (has_image) {
			await delete_from_s3(pid);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export const patch_post_service = async (req) => {
	try {
		const pid = req.body.pid;
		const data = {
			cid: req.body.cid,
			title: req.body.title,
			description: req.body.description,
			location: req.body.location,
			expiration_time: req.body.expiration_time,
			target: req.body.target,
			contact_name: req.body.contact_name,
			contact_phone: req.body.contact_phone,
			contact_email: req.body.contact_email,
			facebook: req.body.facebook,
			instagram: req.body.instagram,
			twitter: req.body.twitter,
			website: req.body.website
		};
		
		let base_query = `UPDATE posts SET`;
		let set_clauses = [];
		let values = [];
		for (let key in data) {
			if (data[key]) {
				if (key === 'location') {
					set_clauses.push(`location = Point($${values.length + 1}, $${values.length + 2})`);
					values.push(data[key].lat);
					values.push(data[key].lng);
				}
				else {
					set_clauses.push(`${key} = $${values.length + 1}`);
					values.push(data[key]);
				}
			}
		}
		if (values.length === 0) {
			throw new Error('No values provided to update');
		}
		if (!pid) { 
			throw new Error('No post id provided');
		}

		const query = `${base_query} ${set_clauses.join(', ')} WHERE pid = $${values.length + 1}`;
		values.push(req.body.pid);
		await dbService.instance.pool.query(query, values);
	}
	catch (error) {
		throw error;
	}

}