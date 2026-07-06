module.exports = (roles = []) => {

  return (req, res, next) => {

    try {

      if (!req.admin) {

        return res.status(401).json({
          success: false,
          message: "Admin belum terautentikasi",
        });

      }

      if (
        !roles.includes(
          req.admin.role
        )
      ) {

        return res.status(403).json({
          success: false,
          message: "Akses ditolak",
        });

      }

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

};