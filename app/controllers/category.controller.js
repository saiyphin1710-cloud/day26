const Category = require("../models/category.model"); //ດຶງ (import) ໄຟລ໌ category.model.js ຈາກໂຟນເດີ modelsເພື່ອນຳມາໃຊ້ເຮັດວຽກກັບຕາຕະລາງ category ໃນ database.

exports.findAll = (req, res) => { //ເອີ້ນຟັງຊັນ getAll() ຈາກ model.ໜ້າທີ່ມັນແມ່ນດຶງຂໍ້ມູນ categories ທັງໝົດຈາກ database.
  Category.getAll((err, data) => {
    if (err) 
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    else
      res.send(data);
  });
};

exports.create = (req, res) => { //ສ້າງຟັງຊັນ create ເພື່ອ export ໄປໃຫ້ routes ໃຊ້.ໃຊ້ສຳລັບບັນທຶກ Category ໃໝ່ເຂົ້າ database.
  if (!req.body.cat_name) { //ກວດວ່າ ຜູ້ໃຊ້ສົ່ງ cat_name ມາຫຼືບໍ່
    res.status(400).send({ //ຄືຄ່າທີ່ client ສົ່ງຜ່ານ body (POST)
      message: "Category name cannot be empty!"
    });
    return;
  }

  const category = new Category({
    cat_name: req.body.cat_name,
    is_deleted: false
  });

  Category.create(category, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the category."
      });
    else
      res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body.cat_name) {
    res.status(400).send({
      message: "Category name cannot be empty!"
    });
    return;
  }

  const category = new Category({
    cat_name: req.body.cat_name,
    is_deleted: req.body.is_deleted || false
  });

  Category.updateById(req.params.id, category, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found category with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating category with id " + req.params.id
        });
      }
    } else
      res.send(data);
  });
};

exports.delete = (req, res) => {
  Category.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found category with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete category with id " + req.params.id
        });
      }
    } else
      res.send({ message: "Category was deleted successfully!" });
  });
};

module.exports = exports;