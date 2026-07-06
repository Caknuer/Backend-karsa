const supabase =
require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

//Get All
exports.getAll = async (req, res) => {
  const { data: users } =
    await supabase
      .from("users")
      .select("*");

  const { data: simpanan } =
    await supabase
      .from("simpanan")
      .select("*");

  const { data: penarikan } =
    await supabase
      .from("penarikan")
      .select("*");

  const result = users.map(user => {

    const totalSimpanan =
      simpanan
        .filter(
          s =>
            s.user_id === user.id
        )
        .reduce(
          (a, b) =>
            a + Number(b.nominal),
          0
        );

    const totalPenarikan =
      penarikan
        .filter(
          p =>
            p.user_id === user.id &&
            p.status === "approved"
        )
        .reduce(
          (a, b) =>
            a + Number(b.nominal),
          0
        );

    return {
      ...user,
      saldo_total:
        totalSimpanan -
        totalPenarikan
    };
  });

  res.json({
    success: true,
    data: result
  });
};

//Panding
exports.getPending = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("status", "pending");

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

//Detail
exports.getById = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      data,
      error
    } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {

      return res.status(404).json({
        success: false,
        message: "Data anggota tidak ditemukan",
      });

    }

    return res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

//Update
exports.update = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nama,
      no_hp,
      alamat,

      jenis_kelamin,
      tempat_lahir,
      tanggal_lahir,
      pekerjaan,

      tipe_keanggotaan,
      status
    } = req.body;

    const {
      data,
      error
    } = await supabase
      .from("users")
      .update({
        nama,
        no_hp,
        alamat,

        jenis_kelamin,
        tempat_lahir,
        tanggal_lahir,
        pekerjaan,

        tipe_keanggotaan,
        status,

        updated_at: new Date()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(
      "UPDATE ANGGOTA ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};


//Approve
exports.approve = async (req, res) => {
  try {

    const { id } = req.params;

    // update status anggota
    const { data, error } = await supabase
      .from("users")
      .update({
        status: "approved",
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // =========================
    // BUAT SIMPANAN POKOK
    // =========================

    await supabase
      .from("simpanan")
      .insert([
        {
          user_id: id,
          jenis_simpanan: "Simpanan Pokok",
          nominal: 100000,
          status: "aktif",
          keterangan: "Simpanan pokok anggota baru",
        },
      ]);

    // =========================
    // BUAT TAGIHAN WAJIB BULAN INI
    // =========================

    const now = new Date();

    const periode =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}`;

    await supabase
      .from("tagihan_simpanan_wajib")
      .insert([
        {
          user_id: id,
          periode,
          nominal: 10000,
          status: "belum_bayar",
        },
      ]);

    await createNotification({

      user_id: data.id,
      title: "Keanggotaan Disetujui",
      message:
        "Selamat! Keanggotaan Anda telah disetujui. Sekarang Anda dapat menggunakan seluruh layanan koperasi.",
      category: "Informasi",
      type: "anggota",
      reference_id: data.id,
    });

    res.json({
      success: true,
      data,
      message: "Anggota disetujui",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

//Reject
exports.reject = async (req, res) => {
  try {

    const { id } = req.params;

    const { data, error } = await supabase
      .from("users")
      .update({
        status: "rejected",
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    await createNotification({

      user_id: data.id,
      title: "Keanggotaan Ditolak",
      message:
        "Mohon maaf, pendaftaran keanggotaan Anda belum dapat disetujui. Silakan hubungi pengurus koperasi untuk informasi lebih lanjut.",
      category: "Informasi",
      type: "anggota",
      reference_id: data.id,
    });

    res.json({
      success: true,
      data,
      message: "Anggota ditolak",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};