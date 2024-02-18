import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Gallery = db.define(
  "gallery",
  {
    post_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false, freezeTableName: true }
);

export default Gallery;
