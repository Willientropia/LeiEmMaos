import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI must be set. Did you forget to set the MongoDB connection string?",
  );
}

const client = new MongoClient(process.env.MONGODB_URI);

let db: Db;

export async function connectToDatabase(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || 'leiemmaos');
    console.log('Connected to MongoDB');
  }
  return db;
}

export { db };