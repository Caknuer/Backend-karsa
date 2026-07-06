const supabase = require("../config/supabase");

// ======================================
// SALDO USER (FLUTTER)
// ======================================
exports.getSaldoByUser = async (req, res) => {

  try {

    const { userId } = req.params;

    // ==========================
    // SIMPANAN
    // ==========================

    const {
      data: simpanan,
      error: simpananError
    } = await supabase
      .from("simpanan")
      .select("*")
      .eq("user_id", userId);

    if (simpananError) throw simpananError;

    // ==========================
    // PENARIKAN
    // ==========================

    const {
      data: penarikan,
      error: penarikanError
    } = await supabase
      .from("penarikan")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "approved");

    if (penarikanError) throw penarikanError;

    // ==========================
    // HITUNG SIMPANAN
    // ==========================

    const simpananPokok =
      simpanan
        .filter(item =>
          item.jenis_simpanan
            ?.toLowerCase()
            .includes("pokok")
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

    const simpananWajib =
      simpanan
        .filter(item =>
          item.jenis_simpanan
            ?.toLowerCase()
            .includes("wajib")
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

    const simpananSukarela =
      simpanan
        .filter(item =>
          item.jenis_simpanan
            ?.toLowerCase()
            .includes("sukarela")
        )
        .reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

    // ==========================
    // TOTAL PENARIKAN
    // ==========================

    const totalPenarikan =
      penarikan.reduce(

        (sum, item) =>

          sum +
          Number(item.nominal),

        0

      );

    // ==========================
    // SALDO YANG DAPAT DITARIK
    // ==========================

    const saldoDapatDitarik =
      Math.max(
        0,
        simpananSukarela -
        totalPenarikan
      );

    // ==========================
    // TOTAL SALDO
    // ==========================

    const totalSaldo =
      simpananPokok +
      simpananWajib +
      saldoDapatDitarik;

    // ==========================
    // RESPONSE
    // ==========================

    res.json({

      success: true,

      data: {

        simpanan_pokok:
          simpananPokok,

        simpanan_wajib:
          simpananWajib,

        // total histori setoran
        total_simpanan_sukarela:
          simpananSukarela,

        // saldo yang tersisa
        simpanan_sukarela:
          saldoDapatDitarik,

        total_penarikan:
          totalPenarikan,

        saldo_dapat_ditarik:
          saldoDapatDitarik,

        saldo:
          totalSaldo

      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ======================================
// SALDO SELURUH ANGGOTA (ADMIN)
// ======================================
exports.getAllSaldo = async (req, res) => {

  try {

    // ==========================
    // AMBIL SEMUA ANGGOTA AKTIF
    // ==========================

    const {
      data: users,
      error: userError
    } = await supabase

      .from("users")

      .select(`
        id,
        nama,
        foto_profile_url
      `)

      .eq(
        "status",
        "approved"
      );

    if (userError) throw userError;

    const result = [];

    // ==========================
    // HITUNG SALDO MASING-MASING
    // ==========================

    for (const user of users) {

      // ----------------------
      // SIMPANAN
      // ----------------------

      const {
        data: simpanan,
        error: simpananError
      } = await supabase

        .from("simpanan")

        .select("*")

        .eq(
          "user_id",
          user.id
        );

      if (simpananError) throw simpananError;

      // ----------------------
      // PENARIKAN
      // ----------------------

      const {
        data: penarikan,
        error: penarikanError
      } = await supabase

        .from("penarikan")

        .select("*")

        .eq(
          "user_id",
          user.id
        )

        .eq(
          "status",
          "approved"
        );

      if (penarikanError) throw penarikanError;

      // ----------------------
      // SIMPANAN POKOK
      // ----------------------

      const simpananPokok =
        simpanan
          .filter(item =>
            item.jenis_simpanan
              ?.toLowerCase()
              .includes("pokok")
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(item.nominal),
            0
          );

      // ----------------------
      // SIMPANAN WAJIB
      // ----------------------

      const simpananWajib =
        simpanan
          .filter(item =>
            item.jenis_simpanan
              ?.toLowerCase()
              .includes("wajib")
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(item.nominal),
            0
          );

      // ----------------------
      // SIMPANAN SUKARELA
      // ----------------------

      const simpananSukarela =
        simpanan
          .filter(item =>
            item.jenis_simpanan
              ?.toLowerCase()
              .includes("sukarela")
          )
          .reduce(
            (sum, item) =>
              sum +
              Number(item.nominal),
            0
          );

      // ----------------------
      // PENARIKAN
      // ----------------------

      const totalPenarikan =
        penarikan.reduce(

          (sum, item) =>

            sum +
            Number(item.nominal),

          0

        );

      // ----------------------
      // SALDO DAPAT DITARIK
      // ----------------------

      const saldoDapatDitarik =
        Math.max(
          0,
          simpananSukarela -
          totalPenarikan
        );

      // ----------------------
      // TOTAL SALDO
      // ----------------------

      const totalSaldo =
        simpananPokok +
        simpananWajib +
        saldoDapatDitarik;

      // ----------------------
      // PUSH
      // ----------------------

      result.push({

        id:
          user.id,

        nama:
          user.nama,

        foto_profile_url:
          user.foto_profile_url,

        simpanan_pokok:
          simpananPokok,

        simpanan_wajib:
          simpananWajib,

        simpanan_sukarela:
          simpananSukarela,

        total_penarikan:
          totalPenarikan,

        saldo_dapat_ditarik:
          saldoDapatDitarik,

        saldo:
          totalSaldo

      });

    }

    // ==========================
    // RESPONSE
    // ==========================

    res.json({

      success: true,

      data: result

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};