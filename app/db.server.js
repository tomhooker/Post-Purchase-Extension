import { PrismaClient } from "@prisma/client";

  let db;

  db = new PrismaClient();
  db.$connect();
  console.log("Production DB connected");

export default db;