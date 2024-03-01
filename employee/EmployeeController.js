import Employee from "./EmployeeModel.js";

export const createEmployee = async (req, res) => {
  const nama = req.body.nama;
  const media = req.body.media;
  const url = req.body.url;
  if (!nama || !media || !url)
    return res.status(400).json({ msg: "Please full fill form" });

  try {
    await Employee.create({
      nama: nama,
      media: media,
      url: url,
    });
    res.status(201).json({ msg: "Employee added" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllEmployee = async (req, res) => {
  const totalEmployee = await Employee.count();
  const result = await Employee.findAll();
  if (result.length === 0)
    return res.status(422).json({ msg: "Employee is empty" });
  res.status(200).json({ result: result, totalEmployee: totalEmployee });
};

export const getEmployeeId = async (req, res) => {
  const employee = await Employee.findOne({
    attributes: ["uuid", "nama", "media", "url"],
    where: {
      uuid: req.params.id,
    },
  });
  if (!employee) return res.status(404).json({ msg: "Employee not found" });
  res.status(200).json(employee);
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findOne({
    attributes: ["uuid", "nama", "media", "url"],
    where: {
      uuid: req.params.id,
    },
  });
  if (!employee) return res.status(404).json({ msg: "Employee not found" });

  let nama = req.body.nama;
  let media = req.body.media;
  let url = req.body.url;
  if (!nama) {
    nama = employee.nama;
  }
  if (!media) {
    media = employee.media;
  }
  if (!url) {
    url = employee.url;
  }

  try {
    await Employee.update(
      {
        nama: nama,
        media: media,
        url: url,
      },
      {
        where: {
          uuid: employee.uuid,
        },
      }
    );
    res.status(200).json({ msg: `employee-${employee.nama}-updated` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!employee) return res.status(404).json({ msg: "Employee not found" });
  try {
    await Employee.destroy({
      where: {
        uuid: employee.uuid,
      },
    });
    res.status(200).json({ msg: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
