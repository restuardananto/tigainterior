import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Dashboard = db.define(
  "dashboard",
  {
    timestamp: {
      type: DataTypes.DATE,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Dashboard;
