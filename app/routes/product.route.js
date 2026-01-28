const auth = require('./authen.route');

module.exports = app => {
    const products = require("../controllers/product.controller.js");
    app.get("/products", auth, products.findAll);
    app.post("/products", auth,products.create);
    app.put("/products/:id", auth, products.update);
    app.delete("/products/:id", auth, products.delete);
}   