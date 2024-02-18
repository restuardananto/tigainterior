import Post from "./PostModel.js";
import { Op } from "sequelize";
import Gallery from "../gallery/GalleryModel.js";

export const createPost = async (req, res) => {
  const title = req.body.title;
  const deskripsi = req.body.deskripsi;
  const kategori = req.body.kategori;
  const kategoriLow = kategori.toLowerCase();

  const allowedKategori = ["desain", "proses", "hasil"];
  if (!allowedKategori.includes(kategoriLow))
    return res.status(422).json({ msg: "Invalid category" });

  try {
    await Post.create({
      title: title,
      deskripsi: deskripsi,
      kategori: kategoriLow,
    });
    res.status(201).json({ msg: "Post uploaded" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllPost = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 50;
  const search = req.query.search || "";
  const offset = limit * page;
  const totalRows = await Post.count({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          deskripsi: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          kategori: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Post.findAll({
    attributes: ["uuid", "title", "deskripsi", "kategori"],
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          deskripsi: {
            [Op.like]: "%" + search + "%",
          },
        },
        {
          kategori: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
  });
  if (!result) return res.status(422).json({ msg: "Post not found" });

  res.status(200).json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getPostId = async (req, res) => {
  const response = await Post.findOne({
    attributes: ["uuid", "title", "deskripsi", "kategori"],
    where: {
      uuid: req.params.id,
    },
  });
  if (!response) return res.status(404).json({ msg: "No data found" });
  res.status(200).json(response);
};

export const updatePost = async (req, res) => {
  const response = await Post.findOne({
    attributes: ["uuid", "title", "deskripsi", "kategori"],
    where: {
      uuid: req.params.id,
    },
  });
  if (!response) return res.status(404).json({ msg: "No data found" });

  let title = req.body.title;
  let deskripsi = req.body.deskripsi;
  let kategori = req.body.kategori;
  if (!title) {
    title = response.title;
  }
  if (!deskripsi) {
    deskripsi = response.deskripsi;
  }
  if (!kategori) {
    kategori = response.kategori;
  }

  try {
    await Post.update(
      {
        title: title,
        deskripsi: deskripsi,
        kategori: kategori,
      },
      {
        where: {
          uuid: response.uuid,
        },
      }
    );
    res.status(200).json({ msg: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePost = async (req, res) => {
  const response = await Post.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!response) return res.status(404).json({ msg: "No data found" });

  const gallery = await Gallery.findAll({
    where: {
      post_id: response.uuid,
    },
  });
  try {
    await Post.destroy({
      where: {
        id: response.id,
      },
    });
    if (gallery) {
      await Gallery.destroy({
        where: {
          post_id: response.uuid,
        },
      });
    }
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
