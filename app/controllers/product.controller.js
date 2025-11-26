const Product = require("../models/product.model.js");

exports.findAll = (req, res) => {
    Product.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Error fetch products"
            });
        else res.send(data);
    });
};

exports.create = (req, res) => {
    console.log("POST /products body:", req.body);
    if (!req.body.product_name || !req.body.price || !req.body.category_id) {
        res.status(400).send({ message: "Product name, price, and category ID cannot be empty!" });
        return;
    }

    const newProduct = new Product({
        product_name: req.body.product_name,
        price: req.body.price,
        category_id: req.body.category_id
    });

    Product.create(newProduct, (error, data) => {
        if (error) console.error("Product.create error:", error);
        if (error) {
            res.status(500).send({ message: error.message || "Some error occurred while creating the Product." });
        } else {
            res.status(201).send(data);
        }
    });
};

exports.update = (req, res) => {
    console.log(`PUT /products/${req.params.id} body:`, req.body);
    if (!req.body) {
        res.status(400).send({ message: "Data to update cannot be empty!" });
        return;
    }

    Product.updateById(req.params.id, req.body, (error, data) => {
        if (error) console.error("Product.updateById error:", error);
        if (error) {
            if (error.kind === "not_found") {
                res.status(404).send({ message: `Product with id ${req.params.id} not found.` });
            } else {
                res.status(500).send({ message: `Error updating Product with id ${req.params.id}` });
            }
        } else {
            res.send(data);
        }
    });
};

exports.delete = (req, res) => {
    Product.remove(req.params.id, (error, data) => {
        if (error) {
            if (error.kind === "not_found") {
                res.status(404).send({ message: `Product with id ${req.params.id} not found.` });
            } else {
                res.status(500).send({ message: `Could not delete product with id ${req.params.id}` });
            }
        } else {
            res.send({ message: "Product was deleted successfully!" });
        }
    });
};