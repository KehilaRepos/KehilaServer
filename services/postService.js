import dbService from "./dbService.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import exp from "constants";
import fs from 'fs';
import { env } from "process";

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
    //location: new Filter('location'),
    expiration_time: new Filter('expiration_time'),
};

export const create_post_retreival_query = async (queryParams) => {
	try {
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

	} catch (error) {
		throw(error);
	}
};

const upload_post_to_db = async (req) => {
	try {
		const data = {
			email: req.body.email,
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
		if (!data.email || !data.cid || !data.title) {
			throw new Error('Missing required fields');
		}
		const user = await dbService.instance.pool.query('SELECT * FROM users WHERE email = $1', [data.email]);
		if (!user.rows.length) {
			throw new Error('User not found');
		}
		const uid = user.rows[0].uid;
		
		for (let value in data) {
			if (!data[value]) {
				data[value] = null;
			}
		}
		const query = `INSERT INTO posts (uid, cid, title, description, location, expiration_time, target, contact_name, contact_phone, contact_email, facebook, instagram, twitter, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
		const queryValues = [uid, data.cid, data.title, data.description, data.location, data.expiration_time, data.target, data.contact_name, data.contact_phone, data.contact_email, data.facebook, data.instagram, data.twitter, data.website];

		await dbService.instance.pool.query(query, queryValues);
	} catch (error) {
		throw error;
	}
}

export const upload_to_s3 = async (file, pid) => {
	try {
		const s3 = new S3Client({
			region: "us-east-1",
			credentials: {
				accessKeyId: process.env.AWS_ACCESS_KEY_ID,
				secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
			}
		});
		const fileStream = fs.createReadStream(file.path);

		const input = {
            Bucket: 'kehilaimagebucket',
            Key: `${pid}.jpg`,
            Body: fileStream
        };

		const command = new PutObjectCommand(input);
		await s3.send(command);

	} catch (error) {
		throw error;
	}
}

export const create_post_service = async (req) => {
	await upload_post_to_db(req);

	const pid = await dbService.instance.pool.query('SELECT pid FROM posts WHERE email = $1', [req.body.email]);

	if (req.file) {
		await upload_to_s3(req.file, pid);
	}
}