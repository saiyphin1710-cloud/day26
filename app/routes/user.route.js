module.exports = app => {
    const user = require ( "../controllers/user.controller" );
    app.post( "/user", user.create );
    app.post( "/user/login", user.login );
}