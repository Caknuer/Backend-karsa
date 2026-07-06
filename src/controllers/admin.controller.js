const supabase =
require("../config/supabase");

const bcrypt =
require("bcryptjs");

const jwt =
require("jsonwebtoken");

exports.login = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const { data, error } =
      await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) {

      return res.status(401).json({
        success: false,
        message:
          "Email tidak ditemukan",
      });

    }

    const match =
      await bcrypt.compare(
        password,
        data.password_hash
      );

    if (!match) {

      return res.status(401).json({
        success: false,
        message:
          "Password salah",
      });

    }

    const token =
      jwt.sign(
        {
          id: data.id,
          role: data.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.json({
      success: true,
      token,
      admin: {
        id: data.id,
        nama: data.nama,
        email: data.email,
        role: data.role,
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};