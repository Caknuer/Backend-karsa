const jwt = require("jsonwebtoken");

const adminAuthMiddleware =
(req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Token admin tidak ditemukan",
      });

    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.admin = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Token admin tidak valid",
    });

  }

};

module.exports =
adminAuthMiddleware;