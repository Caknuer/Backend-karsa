const supabase =
require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

// GET ALL
exports.getAll = async (req, res) => {
  try {

    const { data, error } =
      await supabase
        .from("penarikan")
        .select(`
          *,
          users (
            nama
          )
        `)
        .order("created_at", {
          ascending: false,
        });

    console.log(
      JSON.stringify(
        data,
        null,
        2
      )
    );

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
      .from("penarikan")
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

// ======================================
// GET DETAIL PENARIKAN
// ======================================
exports.getById = async (req, res) => {

  try {

    const { id } = req.params;

    const { data, error } = await supabase
      .from("penarikan")
      .select(`
        *,
        users (
          id,
          nama,
          foto_profile_url
        )
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

exports.create = async (req, res) => {
  try {

    console.log(req.body);

    const {
      user_id,
      nominal,
      keterangan
    } = req.body;

    const { data: simpanan } = await supabase
      .from("simpanan")
      .select("nominal")
      .eq("user_id", user_id)
      .ilike(
        "jenis_simpanan",
        "%sukarela%"
      );

    const totalSimpanan =
      (simpanan || []).reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );

    const { data: penarikan } = await supabase
      .from("penarikan")
      .select("nominal")
      .eq("user_id", user_id)
      .eq("status", "approved");

    const totalPenarikan =
      (penarikan || []).reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );

    const saldo =
      totalSimpanan -
      totalPenarikan;

    if (Number(nominal) > saldo) {
      return res.status(400).json({
        success: false,
        message:
          "Saldo tidak mencukupi",
      });
    }

    const { data, error } =
      await supabase
        .from("penarikan")
        .insert([
          {
            user_id,
            nominal,
            keterangan,
            status: "pending",
          },
        ])
        .select()
        .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message:
        "Permintaan penarikan berhasil dibuat",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// APPROVE
exports.approve = async (req, res) => {
  try {

    const { id } = req.params;

    const { data: penarikan, error } =
      await supabase
        .from("penarikan")
        .update({
          status: "approved",
          updated_at: new Date(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    await createNotification({

      user_id:
          penarikan.user_id,
      title:
          "Penarikan Disetujui",
      message:
          "Pengajuan penarikan Anda telah disetujui.",
      category:
          "Transaksi",
      type:
          "penarikan",
      reference_id:
          penarikan.id,

    });

    res.json({
      success: true,
      data: penarikan,
      message: "Penarikan disetujui",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// REJECT
exports.reject = async (req, res) => {
  try {

    const { id } = req.params;

    const { data: penarikan, error } =
      await supabase
        .from("penarikan")
        .update({
          status: "rejected",
          updated_at: new Date(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    await createNotification({

      user_id:
          penarikan.user_id,
      title:
          "Penarikan Ditolak",
      message:
          "Pengajuan penarikan Anda ditolak.",
      category:
          "Transaksi",
      type:
          "penarikan",
      reference_id:
          penarikan.id,

    });

    res.json({
      success: true,
      data: penarikan,
      message: "Penarikan ditolak",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};