require("dotenv").config();

const { Pool } = require("pg");
const supertest = require("supertest");
const sequelize = require("../src/utils/database");

const app = require("../src/app");

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
    await db.query("DELETE FROM genre_recommend;");
    await db.query("DELETE FROM genres;");
    await db.query("DELETE FROM recommendations;");
});
  
afterAll(async () => {
    await db.end();
    await sequelize.close();
});