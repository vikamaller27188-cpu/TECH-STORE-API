const config = require("../config");
const AppError = require("../utils/AppError");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return next(new AppError("Требуется авторизация (Basic Auth)", 401));
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
        "ascii",
    );

    const [username, password] = credentials.split(":");
    
    if (
        username === config.ADMIN_CREDENTIALS.username &&
        password === config.ADMIN_CREDENTIALS.password
    ) {
        next();
    } else {
        return next(new AppError("Неверные учетные данные", 401));
    }
};

module.exports = authMiddleware;