const admin = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token?.substring(0, 50));

    const decodedToken =
      await admin.auth().verifyIdToken(token);

    console.log("DECODED:", decodedToken);

    req.user = decodedToken;

    next();
  } catch (error) {
    console.log("VERIFY ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Token tidak valid",
      error: error.message,
    });
  }
};

module.exports = verifyFirebaseToken;