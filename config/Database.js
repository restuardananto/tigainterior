import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(
  `${process.env.DB}`,
  `${process.env.USER_DB}`,
  `${process.env.PASS_DB}`,
  {
    dialect: "mysql",
    host: "127.0.0.1",
    timezone: "+07:00",
  }
);

export default db;
