import User from "./UserModel.js";
import argon2 from "argon2";

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name) {
    return res.status(409).json({
      msg: "Please input name",
    });
  }
  if (!email) {
    return res.status(409).json({
      msg: "Please input email",
    });
  }
  if (!password) {
    return res.status(409).json({
      msg: "Please input password",
    });
  }
  const emailCheck = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (emailCheck)
    return res.status(409).json({
      msg: "User telah terdaftar, cobalah mendaftar dengan email lainnya",
    });
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Confirm password belum sesuai" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    res.status(201).json({ msg: "Register berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "email"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "email"],
      where: {
        uuid: req.params.id,
      },
    });
    if (!response) return res.status(404).json({ msg: "User tidak ada" });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { name, email, password, confirmPassword } = req.body;
  if (name === "" || name === null) {
    name = user.name;
  }
  if (email === "" || email === null) {
    email = user.email;
  }
  let hashPassword;
  password === "" || password === null
    ? (hashPassword = user.password)
    : (hashPassword = await argon2.hash(password));
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Pastikan password telah sesuai" });
  try {
    await User.update(
      {
        name: name,
        email: email,
        password: hashPassword,
      },
      {
        where: { id: user.id },
      }
    );
    res.status(200).json({ msg: "User terupdate" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
