const { response } = require("express");
const sql = require("./db.js");

//constructor
const Product = function (Product) {
    this.product_name = Product.product_name;
    this.category_id = Product.category_id;
    this.price = Product.price;
};

Product.getAll = result => {
    sql.query("SELECT * FROM products", (err, res) => {
        if (err) {
            console.log ("Error: ", err);
            result(err, null);
            return;
        }
        console.log("Products fetched successfully");
        result(null, res);
    });
};

Product.create = (newProduct, result) => {
    console.log(newProduct)
    sql.query("INSERT INTO products SET ?", newProduct, (error, response) => {
        if (error) {
            console.log(error);
            result (error, null);
            return;
        }
        result(null, { product_id: response.insertId, ...newProduct });
    });
};

Product.updateById = (id, updatedProduct, result) => {
    // Build the update query with explicit field names
    let updateQuery = "UPDATE products SET ";
    let updateFields = [];
    let updateValues = [];

    if (updatedProduct.product_name !== undefined && updatedProduct.product_name !== null) {
        updateFields.push("product_name = ?");
        updateValues.push(updatedProduct.product_name);
    }
    if (updatedProduct.category_id !== undefined && updatedProduct.category_id !== null) {
        updateFields.push("category_id = ?");
        updateValues.push(updatedProduct.category_id);
    }
    if (updatedProduct.price !== undefined && updatedProduct.price !== null) {
        updateFields.push("price = ?");
        updateValues.push(updatedProduct.price);
    }

    // Check if there's at least one field to update
    if (updateFields.length === 0) {
        result({ kind: "empty_update" }, null);
        return;
    }

    updateQuery += updateFields.join(", ") + " WHERE product_id = ?";
    updateValues.push(id);

    sql.query(updateQuery, updateValues, (error, response) => {
        if (error) {
            console.error("Update Error:", error);
            result(error, null);
            return;
        }

        if (response.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, { product_id: id, ...updatedProduct });
    });
};


Product.remove = (id, result) => {
    sql.query("DELETE FROM products WHERE product_id = ?", id, (error, response) => {
        if (error) {
            console.error("Delete Error:", error);
            result(error, null);
            return;
        }

        if (response.affectedRows === 0) {
            result({ kind: "not_found" }, null);
            return;
        }

        result(null, response);
    });
};

module.exports = Product;