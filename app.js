import express from "express";
import db from "./config/Database.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./auth/UserRoute.js";
import AuthRoute from "./auth/AuthRoute.js";
import GalleryRoute from "./gallery/GalleryRoute.js";
import PostRoute from "./post/PostRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  checkExpirationInterval: 1 * 60 * 60 * 1000,
});

// Singkronasi database mysql
// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: store,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      secure: "auto",
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("dist"));
app.use(UserRoute);
app.use(AuthRoute);
app.use(GalleryRoute);
app.use(PostRoute);

app.listen(process.env.PORT, () => {
  console.log(`Running on PORT ${process.env.PORT}`);
});
