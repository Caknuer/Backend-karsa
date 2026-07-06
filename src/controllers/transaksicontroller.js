const supabase = require("../config/supabase");

exports.getByUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const { data: simpanan, error: simpananError } =
      await supabase
        .from("simpanan")
        .select("*")
        .eq("user_id", userId);

    if (simpananError) throw simpananError;

    const { data: penarikan, error: penarikanError } =
      await supabase
        .from("penarikan")
        .select("*")
        .eq("user_id", userId);

    if (penarikanError) throw penarikanError;

    const transaksiSimpanan = simpanan.map(item => ({
      id: item.id,
      jenis: "simpanan",
      kategori: item.jenis_simpanan,
      nominal: item.nominal,
      status: item.status,
      tanggal: item.tanggal,
      created_at: item.created_at,
      keterangan: item.keterangan,
    }));

    const transaksiPenarikan = penarikan.map(item => ({
      id: item.id,
      jenis: "penarikan",
      kategori: "Penarikan Dana",
      nominal: item.nominal,
      status: item.status,
      tanggal: item.tanggal,
      created_at: item.created_at,
      keterangan: item.keterangan,
    }));

    const transaksi = [
      ...transaksiSimpanan,
      ...transaksiPenarikan,
    ];

    transaksi.sort(
      (a, b) =>
        new Date(b.created_at) -
        new Date(a.created_at)
    );

    res.json({
      success: true,
      data: transaksi,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};