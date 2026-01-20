import { MongoClient, Db } from "mongodb";

const MONGODB_DB = process.env.MONGODB_DB || "lovecode";

interface MongoClientCache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoClientCache: MongoClientCache | undefined;
}

const cached: MongoClientCache = global.mongoClientCache || {
  client: null,
  db: null,
  promise: null,
};

if (!global.mongoClientCache) {
  global.mongoClientCache = cached;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(uri).then((client) => {
      const db = client.db(MONGODB_DB);
      return { client, db };
    });
  }

  const { client, db } = await cached.promise;
  cached.client = client;
  cached.db = db;

  return { client, db };
}
