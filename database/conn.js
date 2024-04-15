import mongoose from "mongoose";

export default async function connect() {
  mongoose.set("strictQuery", true);
  const database = await mongoose.connect(process.env.DATABASE_ATLAS_URL);
  console.log("database Connected ");

  return database;
}
