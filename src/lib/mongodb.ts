import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "lovecode";

console.log("MongoDB URI exists:", !!MONGODB_URI);
console.log("MongoDB URI starts with:", MONGODB_URI?.substring(0, 20));

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

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

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then((client) => {
      const db = client.db(MONGODB_DB);
      return { client, db };
    });
  }

  const { client, db } = await cached.promise;
  cached.client = client;
  cached.db = db;

  return { client, db };
}
