import Gallery from "./GalleryModel.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

export const createGallery = (req, res) => {
  if (req.files === null)
    return res.status(400).json({ msg: "POST must be a file" });

  const postId = req.body.post_id;
  const foto = req.files.foto;
  const fileSize = foto.data.length;
  const ext = path.extname(foto.name);
  const convertName = foto.md5 + ext;
  let checkItem = true;
  let fileName = "";

  for (let i = 1; checkItem !== false; i++) {
    const checkIterasi = fs.existsSync(`./public/gallery/${i}-${convertName}`);
    if (checkIterasi === false) {
      checkItem = false;
      fileName = `${i}-${convertName}`;
    }
  }

  // const url = `${req.protocol}://${req.get("host")}/gallery/${fileName}`;
  const url = `${process.env.PROTOCOL}://${req.get(
    "host"
  )}/gallery/${fileName}`;
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!postId) return res.status(400).json({ msg: "Please add a post" });
  if (!allowedType.includes(ext.toLocaleLowerCase()))
    return res.status(422).json({ msg: "Invalid images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Max image size 5MB" });

  foto.mv(`./public/gallery/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Gallery.create({
        post_id: postId,
        foto: fileName,
        url: url,
      });
      res.status(201).json({ msg: "Photo uploaded" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  });
};

export const getAllGallery = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const offset = limit * page;
  const totalRows = await Gallery.count();
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Gallery.findAll({
    attributes: ["post_id", "url"],
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  if (result.length === 0)
    return res.status(422).json({ msg: "File not found" });
  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getGalleryPost = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const parameter = req.params.post_id;
  const offset = limit * page;
  const totalRows = await Gallery.count({
    where: {
      post_id: parameter,
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Gallery.findAll({
    attributes: ["id", "post_id", "foto", "url"],
    where: {
      post_id: parameter,
    },
    offset: offset,
    limit: limit,
    order: [["id", "DESC"]],
  });
  if (result.length === 0)
    return res.status(422).json({ msg: "File not found" });
  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

// export const getGalleryId = async (req, res) => {
//   try {
//     const response = await Gallery.findOne({
//       attributes: ["post_id", "url"],
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (!response) return res.status(404).json({ msg: "No data found" });
//     res.status(200).json(response);
//   } catch (error) {
//     res.status(500).json({ msg: error.message });
//   }
// };

export const updateGallery = async (req, res) => {
  const gallery = await Gallery.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!gallery) return res.status(404).json({ msg: "No data found" });

  let fileName = "";
  if (req.files === null) {
    fileName = gallery.foto;
  } else {
    const foto = req.files.foto;
    const ext = path.extname(foto.name);
    const convertName = foto.md5 + ext;
    let checkItem = true;
    for (let i = 1; checkItem !== false; i++) {
      const checkIterasi = fs.existsSync(
        `./public/gallery/${i}-${convertName}`
      );
      if (checkIterasi === false) {
        checkItem = false;
        fileName = `${i}-${convertName}`;
      }
    }

    const fileSize = foto.data.length;
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Max image size 5MB" });

    const allowedType = [".png", ".jpg", ".jpeg"];
    if (!allowedType.includes(ext.toLocaleLowerCase()))
      return res.status(422).json({ msg: "Invalid images" });

    const filePath = `./public/gallery/${gallery.foto}`;
    fs.unlinkSync(filePath);
    foto.mv(`./public/gallery/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  // const url = `${req.protocol}://${req.get("host")}/gallery/${fileName}`;
  const url = `${process.env.PROTOCOL}://${req.get(
    "host"
  )}/gallery/${fileName}`;
  try {
    await Gallery.update({
      post_id: gallery.post_id,
      foto: fileName,
      url: url,
    });
    res.status(200).json({ msg: "Gallery updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteGallery = async (req, res) => {
  const gallery = await Gallery.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!gallery) return res.status(404).json({ msg: "No data found" });

  try {
    const filePath = `./public/gallery/${gallery.foto}`;
    fs.unlinkSync(filePath);
    await Gallery.destroy({
      where: {
        id: gallery.id,
      },
    });
    res.status(200).json({ msg: "Gallery deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
