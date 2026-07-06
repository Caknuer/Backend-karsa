const supabase = require("../config/supabase");

exports.getAllManagements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("managements")
      .select("*")
      .eq("is_active", true)
      .order("urutan", {
        ascending: true,
        nullsFirst: false,
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

exports.getManagementById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("managements")
      .select("*")
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

exports.createManagement = async (req, res) => {
  try {
    const {
      nama,
      jabatan,
      foto_url,
      no_hp,
      email,
      urutan,
    } = req.body;

    const { data, error } = await supabase
      .from("managements")
      .insert([
        {
          nama,
          jabatan,
          foto_url,
          no_hp,
          email,
          urutan,
        },
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: "Pengurus berhasil ditambahkan",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateManagement = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nama,
      jabatan,
      foto_url,
      no_hp,
      email,
      urutan,
      is_active,
    } = req.body;

    const { data, error } = await supabase
      .from("managements")
      .update({
        nama,
        jabatan,
        foto_url,
        no_hp,
        email,
        urutan,
        is_active,
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Pengurus berhasil diperbarui",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteManagement = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("managements")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Pengurus berhasil dihapus",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};