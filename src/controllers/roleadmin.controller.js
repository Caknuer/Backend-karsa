const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");

/*
|--------------------------------------------------------------------------
| GET ALL ADMINS
|--------------------------------------------------------------------------
*/
exports.getAllAdmins = async (req, res) => {
  try {

    const { data, error } =
      await supabase
        .from("admins")
        .select(`
          id,
          nama,
          email,
          role,
          is_active,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| CREATE ADMIN
|--------------------------------------------------------------------------
*/
exports.createAdmin = async (req, res) => {
  try {

    const {
      nama,
      email,
      password,
      role,
    } = req.body;

    // validasi input
    if (
      !nama ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "Semua field wajib diisi",
      });
    }

    // validasi role
    const allowedRoles = [
      "super_admin",
      "admin",
    ];

    if (
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: "Role tidak valid",
      });
    }

    // cek email sudah ada
    const {
      data: existingAdmin,
    } = await supabase
      .from("admins")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Email sudah digunakan",
      });
    }

    // hash password
    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    const { data, error } =
      await supabase
        .from("admins")
        .insert([
          {
            nama,
            email,
            password_hash:
              passwordHash,
            role,
            is_active: true,
          },
        ])
        .select(`
          id,
          nama,
          email,
          role,
          is_active,
          created_at
        `)
        .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message:
        "Admin berhasil dibuat",
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS ADMIN
|--------------------------------------------------------------------------
*/
exports.changeStatus = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const { is_active } =
      req.body;

    if (
      typeof is_active !==
      "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "is_active harus boolean",
      });
    }

    // cegah nonaktifkan diri sendiri
    if (
      req.admin.id === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tidak dapat menonaktifkan akun sendiri",
      });
    }

    const { data, error } =
      await supabase
        .from("admins")
        .update({
          is_active,
        })
        .eq("id", id)
        .select(`
          id,
          nama,
          email,
          role,
          is_active,
          created_at
        `)
        .single();

    if (error) throw error;

    res.json({
      success: true,
      message:
        is_active
          ? "Admin diaktifkan"
          : "Admin dinonaktifkan",
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
|--------------------------------------------------------------------------
| GET ADMIN DETAIL
|--------------------------------------------------------------------------
*/
exports.getAdminById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const { data, error } =
      await supabase
        .from("admins")
        .select(`
          id,
          nama,
          email,
          role,
          is_active,
          created_at
        `)
        .eq("id", id)
        .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
/*
|--------------------------------------------------------------------------
| UPDATE ADMIN
|--------------------------------------------------------------------------
*/
exports.updateAdmin = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const {
      nama,
      email,
      role,
    } = req.body;

    if (
      !nama ||
      !email ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nama, email dan role wajib diisi",
      });
    }

    const allowedRoles = [
      "super_admin",
      "admin",
    ];

    if (
      !allowedRoles.includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role tidak valid",
      });
    }

    const { data, error } =
      await supabase
        .from("admins")
        .update({
          nama,
          email,
          role,
        })
        .eq("id", id)
        .select(`
          id,
          nama,
          email,
          role,
          is_active,
          created_at
        `)
        .single();

    if (error) throw error;

    res.json({
      success: true,
      message:
        "Admin berhasil diperbarui",
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};
/*
|--------------------------------------------------------------------------
| DELETE ADMIN
|--------------------------------------------------------------------------
*/
exports.deleteAdmin = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    // cegah hapus diri sendiri
    if (
      req.admin.id === id
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Tidak dapat menghapus akun sendiri",
      });
    }

    const { error } =
      await supabase
        .from("admins")
        .delete()
        .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message:
        "Admin berhasil dihapus",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};