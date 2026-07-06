const supabase = require("../config/supabase");

exports.getDashboard = async (req, res) => {
  try {
    const { count: totalAnggota } =
      await supabase
        .from("users")
        .select("*", {
          count: "exact",
          head: true,
        });
    const { data: simpanan } =
      await supabase
        .from("simpanan")
        .select("nominal");
    const totalSimpanan =
      (simpanan || []).reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );
    const { data: penarikan } =
      await supabase
        .from("penarikan")
        .select("nominal")
        .eq("status", "approved");
    const totalPenarikan =
      (penarikan || []).reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );
    const { count: pendingPenarikan } =
      await supabase
        .from("penarikan")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "pending");
    const { data: beritaTerbaru } =
      await supabase
        .from("news")
        .select("*")
        .limit(5)
        .order("created_at", {
          ascending: false,
        });
    res.json({
      success: true,
      data: {
        total_anggota: totalAnggota,
        total_simpanan: totalSimpanan,
        total_penarikan: totalPenarikan,
        penarikan_pending:
          pendingPenarikan,
        berita_terbaru:
          beritaTerbaru,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};