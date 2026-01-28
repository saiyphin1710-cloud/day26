const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

// ADD THESE TWO LINES - This tells Express to parse JSON from requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Then add your routes AFTER this
const db = require("./app/config/db.config");

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my API" });
});

require("./app/routes/product.route")(app);
require("./app/routes/user.route")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}.`);
});