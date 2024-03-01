import Dashboard from "./DashboardModel.js";
import { Op } from "sequelize";

// stats sebagai middleware
// export const middlewareStats = async (req, res, next) => {
//   const ipAddress =
//     req.headers["x-forwarded-for"] || req.connection.remoteAddress;
//   const timeStamps = new Date().toISOString();
//   const url = req.url;

//   await Dashboard.create({
//     timestamp: timeStamps,
//     ip_address: ipAddress,
//     url: url,
//   });
//   next();
// };

export const createStats = async (req, res) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const timeStamps = new Date().toISOString();
  const url = req.body.url;

  await Dashboard.create({
    timestamp: timeStamps,
    ip_address: ipAddress,
    url: url,
  });
  res.status(200).json({ msg: "Thank you !!!" });
};

export const getStats = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const offset = limit * page;
  const totalRows = await Dashboard.count({});
  const totalKunjungan = await Dashboard.count({
    where: {
      url: "Landing Page",
    },
  });
  const totalAksesPost = await Dashboard.count({
    where: {
      url: "Post Page",
    },
  });
  const totalPage = Math.ceil(totalRows / limit);

  const result = await Dashboard.findAll({
    attributes: ["timestamp", "ip_address", "url"],
    offset: offset,
    limit: limit,
  });
  if (!result) return res.status(422).json({ msg: "Data not found" });

  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    dataKunjungan: totalKunjungan,
    dataAksesPost: totalAksesPost,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
