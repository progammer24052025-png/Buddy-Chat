// ========================================
// MONGODB CONNECTION — db.js
// ========================================
// This file establishes the connection to MongoDB (our database).
// It's called ONCE at server startup (from server.js) BEFORE the server
// starts accepting requests — ensuring the database is ready.
//
// Why MongoDB? It stores data as JSON-like documents, which maps naturally
// to JavaScript objects. Our User, Message, and Group models are defined
// using Mongoose (an ORM/ODM — Object Document Mapper).
//
// MONGO_URI in .env looks like:
//   mongodb+srv://username:password@cluster0.mongodb.net/?appName=...
// The `+srv` means it's a MongoDB Atlas (cloud) connection string.
// ========================================

// mongoose: The MongoDB ODM (Object Document Mapper) for Node.js.
// It lets us define "models" (schemas) for our data, like User or Message,
// and provides methods like .find(), .create(), .updateMany(), etc.
// Without Mongoose, you'd use raw MongoDB commands which are harder to manage.
import mongoose from "mongoose";

// ENV: Contains MONGO_URI from the .env file.
import { ENV } from "./env.js";

// connectDB: Async function that connects to MongoDB.
// It's exported so server.js can call it before starting the HTTP server.
export const connectDB = async () => {
  try {
    // Extract MONGO_URI from our environment config.
    const { MONGO_URI } = ENV;

    // Safety check: If MONGO_URI is missing or empty, throw an error.
    // This prevents the app from silently failing with a bad connection string.
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    // mongoose.connect(): Establishes the connection to MongoDB.
    // This is an async operation — it takes a few seconds to connect.
    // Once connected, all Mongoose model operations (User.find(), Message.create(), etc.)
    // will work. If you try to use models BEFORE this completes, you'll get errors.
    const conn = await mongoose.connect(ENV.MONGO_URI);

    // Log success: conn.connection.host shows the MongoDB server hostname.
    // For Atlas (cloud), this will be something like "cluster0-shard-00-00.xxx.mongodb.net".
    console.log("MONGODB CONNECTED:", conn.connection.host);
  } catch (error) {
    // If connection fails (wrong credentials, network issue, etc.):
    console.error("Error connection to MONGODB:", error);

    // process.exit(1): Terminates the Node.js process with exit code 1 (failure).
    // Why? If we can't connect to the database, the app is useless — no login,
    // no messages, nothing. Better to crash loudly than run in a broken state.
    // Exit code 0 = success, 1 = failure (standard Unix convention).
    process.exit(1);
  }
};
