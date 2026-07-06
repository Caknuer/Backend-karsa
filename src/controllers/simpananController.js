const supabase = require("../config/supabase");

// GET ALL
exports.getAll = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("simpanan")
      .select(`
        *,
        users (
          nama
        )
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

// GET BY USER
exports.getByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const { data, error } = await supabase
      .from("simpanan")
      .select("*")
      .eq("user_id", userId)
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

// CREATE
exports.create = async (req, res) => {
  try {

    const {
      user_id,
      jenis_simpanan,
      nominal,
      keterangan
    } = req.body;

    const { data, error } = await supabase
      .from("simpanan")
      .insert([
        {
          user_id,
          jenis_simpanan,
          nominal,
          keterangan
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: "Simpanan berhasil ditambahkan",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// UPDATE
exports.update = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      jenis_simpanan,
      nominal,
      status,
      keterangan
    } = req.body;

    const { data, error } = await supabase
      .from("simpanan")
      .update({
        jenis_simpanan,
        nominal,
        status,
        keterangan,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Simpanan berhasil diperbarui",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// DELETE
exports.remove = async (req, res) => {
  try {

    const { id } = req.params;

    const { error } = await supabase
      .from("simpanan")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Simpanan berhasil dihapus",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

exports.getTotalByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const { data, error } = await supabase
      .from("simpanan")
      .select("nominal")
      .eq("user_id", userId);

    if (error) throw error;

    const total = data.reduce(
      (sum, item) => sum + Number(item.nominal),
      0
    );

    res.json({
      success: true,
      total,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};