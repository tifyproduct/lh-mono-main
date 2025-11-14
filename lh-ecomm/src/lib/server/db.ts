import { DB_URL, DB_NAME } from '$env/static/private';
import { Db, MongoClient } from 'mongodb';

const client = new MongoClient(DB_URL);

// connect to the database
export async function connect(): Promise<void> {
	await client.connect();
}

// disconnect from the database
export async function disconnect(): Promise<void> {
	await client.close();
}

// get the database
export function getDB(): Db {
	return client.db(DB_NAME);
}
