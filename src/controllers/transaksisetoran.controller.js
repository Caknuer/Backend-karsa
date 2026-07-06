const supabase = require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

// GET ALL
exports.getAll = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("transaksi_setoran")
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
      .from("transaksi_setoran")
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

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("transaksi_setoran")
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

// CREATE
exports.create = async (req, res) => {
  try {

    const {
      user_id,
      jenis_simpanan,
      nominal,
      metode_pembayaran,
      bukti_pembayaran,
      keterangan,
      periode_tagihan
    } = req.body;

    const { data, error } = await supabase
      .from("transaksi_setoran")
      .insert([
        {
          user_id,
          jenis_simpanan,
          nominal,
          metode_pembayaran,
          bukti_pembayaran,
          keterangan,
          periode_tagihan,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: "Transaksi setoran berhasil dibuat",
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

    // Ambil transaksi
    const { data: transaksi, error: transaksiError } =
      await supabase
        .from("transaksi_setoran")
        .select("*")
        .eq("id", id)
        .single();

    if (transaksiError) throw transaksiError;
      
    if (!transaksi) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }
    
    const periodeTagihan = transaksi.periode_tagihan || [];

    if (transaksi.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Transaksi sudah diapprove",
      });
    }
    if (transaksi.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Transaksi sudah ditolak",
      });
    }

    // ======================================
    // VALIDASI TAGIHAN
    // ======================================

    if (
      transaksi.jenis_simpanan ===
        "Simpanan Wajib" &&
      periodeTagihan.length > 0
    ) {

      const {
        data: tagihanDipilih,
        error: cekError,
      } = await supabase
        .from("tagihan_simpanan_wajib")
        .select("*")
        .eq(
          "user_id",
          transaksi.user_id,
        )
        .in(
          "periode",
          periodeTagihan,
        );
      if (cekError)
        throw cekError;
      if (
        tagihanDipilih.length !==
        periodeTagihan.length
      ) {
        return res.status(400).json({
          success:false,
          message:
            "Sebagian tagihan tidak ditemukan."
        });
      }

      const sudahLunas =
        tagihanDipilih.filter(
          item =>
            item.status === "lunas"
        );

      if (sudahLunas.length > 0) {
        return res.status(400).json({
          success:false,
          message:
            "Ada tagihan yang sudah lunas."
        });
      }
    }

    // Update transaksi
    const { error: updateError } =
      await supabase
        .from("transaksi_setoran")
        .update({
          status: "approved",
          updated_at: new Date(),
        })
        .eq("id", id);

    if (updateError) throw updateError;

    // Masukkan ke simpanan
    const { error: simpananError } =
      await supabase
        .from("simpanan")
        .insert([
          {
            user_id: transaksi.user_id,
            jenis_simpanan:
              transaksi.jenis_simpanan,
            nominal:
              transaksi.nominal,
            status: "aktif",
            keterangan:
              transaksi.keterangan,
          },
        ]);

    if (simpananError) throw simpananError;

    // ======================================
    // UPDATE TAGIHAN MENJADI LUNAS
    // ======================================

    if (
      transaksi.jenis_simpanan ===
        "Simpanan Wajib" &&
      periodeTagihan.length > 0
    ) {
      const {
        error: tagihanError,
      } = await supabase
          .from("tagihan_simpanan_wajib")
          .update({
            status: "lunas",
            tanggal_bayar: new Date(),
            updated_at: new Date(),
          })

          .eq(
            "user_id",
            transaksi.user_id,
          )

          .in(
            "periode",
            periodeTagihan,
          );

      if (tagihanError)
        throw tagihanError;
    }

    await createNotification({

      user_id: transaksi.user_id,
      title: "Setoran Disetujui",
      message:
        `Setoran ${transaksi.jenis_simpanan} sebesar Rp ${Number(transaksi.nominal).toLocaleString("id-ID")} telah disetujui.`,
      category: "Transaksi",
      type: "setoran",
      reference_id: transaksi.id,
    });

    res.json({
      success: true,
      message:
        "Setoran berhasil diapprove",
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

    const { data: transaksi, error: transaksiError } =
      await supabase
        .from("transaksi_setoran")
        .select("*")
        .eq("id", id)
        .single();  

    if (transaksiError) throw transaksiError;

    await createNotification({

      user_id: transaksi.user_id,
      title: "Setoran Ditolak",
      message:
        `Setoran ${transaksi.jenis_simpanan} sebesar Rp ${Number(transaksi.nominal).toLocaleString("id-ID")} telah ditolak.`,
      category: "Transaksi",
      type: "setoran",
      reference_id: transaksi.id,
    });

    res.json({
      success: true,
      message:
        "Transaksi berhasil ditolak",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};