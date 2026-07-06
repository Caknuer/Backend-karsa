const supabase = require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

// ======================================
// GET ALL TAGIHAN (ADMIN)
// ======================================
exports.getAllTagihan = async (req, res) => {

  try {

    const { data, error } = await supabase
      .from("tagihan_simpanan_wajib")
      .select(`
        *,
        users (
          id,
          nama,
          foto_profile_url
        )
      `)
      .order("jatuh_tempo", {
        ascending: false,
      });

    if (error) throw error;

    res.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ======================================
// DASHBOARD TAGIHAN ADMIN
// ======================================
exports.getDashboard = async (req, res) => {

  try {

    // ============================
    // Ambil seluruh anggota aktif
    // ============================

    const {
      data: users,
      error: userError,
    } = await supabase
      .from("users")
      .select(`
        id,
        nama,
        foto_profile_url
      `)
      .eq("status", "approved");

    if (userError) throw userError;

    // ============================
    // Ambil seluruh tagihan
    // ============================

    const {
      data: semuaTagihan,
      error: tagihanError,
    } = await supabase
      .from("tagihan_simpanan_wajib")
      .select("*");

    if (tagihanError) throw tagihanError;

    // ============================
    // Ambil seluruh simpanan
    // ============================

    const {
      data: semuaSimpanan,
      error: simpananError,
    } = await supabase
      .from("simpanan")
      .select(`
        user_id,
        nominal
      `);

    if (simpananError) throw simpananError;

    // ============================
    // Ambil seluruh penarikan
    // ============================

    const {
      data: semuaPenarikan,
      error: penarikanError,
    } = await supabase
      .from("penarikan")
      .select(`
        user_id,
        nominal,
        status
      `)
      .eq("status", "approved");

    if (penarikanError) throw penarikanError;

    // ============================
    // Susun Dashboard
    // ============================

    const dashboard = users.map(user => {

      const tagihanUser =
        semuaTagihan.filter(
          item =>
            item.user_id === user.id
        );

      const simpananUser =
        semuaSimpanan.filter(
          item =>
            item.user_id === user.id
        );

      const penarikanUser =
        semuaPenarikan.filter(
          item =>
            item.user_id === user.id
        );

      // ----------------------

      const totalSimpanan =
        simpananUser.reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

      const totalPenarikan =
        penarikanUser.reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

      const saldo =
        totalSimpanan -
        totalPenarikan;

      // ----------------------

      const tunggakan =
        tagihanUser.filter(
          item =>
            item.status ===
            "belum_bayar"
        );

      const totalTunggakan =
        tunggakan.reduce(
          (sum, item) =>
            sum + Number(item.nominal),
          0
        );

      // ----------------------

      const pembayaranTerakhir =
        tagihanUser
          .filter(
            item =>
              item.status ===
              "lunas"
          )
          .sort(
            (a, b) =>
              new Date(
                b.tanggal_bayar
              ) -
              new Date(
                a.tanggal_bayar
              )
          );

      return {

        id:
          user.id,

        nama:
          user.nama,

        foto_profile_url:
          user.foto_profile_url,

        saldo,

        jumlah_tunggakan:
          tunggakan.length,

        total_tunggakan:
          totalTunggakan,

        terakhir_bayar:
          pembayaranTerakhir.length
            ? pembayaranTerakhir[0].periode
            : "-",

      };

    });

    res.json({

      success: true,

      data: dashboard,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// DETAIL TAGIHAN ANGGOTA
// ======================================
exports.getDetail = async (req, res) => {

  try {

    const { userId } = req.params;

    // ===========================
    // DATA USER
    // ===========================

    const {
      data: user,
      error: userError
    } = await supabase
      .from("users")
      .select(`
        id,
        nama,
        foto_profile_url,
        status
      `)
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    // ===========================
    // DATA TAGIHAN
    // ===========================

    const {
      data: tagihan,
      error: tagihanError
    } = await supabase
      .from("tagihan_simpanan_wajib")
      .select("*")
      .eq("user_id", userId)
      .order("jatuh_tempo", {
        ascending: true
      });

    if (tagihanError) throw tagihanError;

    // ===========================
    // DATA SIMPANAN
    // ===========================

    const {
      data: simpanan
    } = await supabase
      .from("simpanan")
      .select("nominal")
      .eq("user_id", userId);

    // ===========================
    // DATA PENARIKAN
    // ===========================

    const {
      data: penarikan
    } = await supabase
      .from("penarikan")
      .select("nominal")
      .eq("user_id", userId)
      .eq("status", "approved");

    const totalSimpanan =
      simpanan.reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );

    const totalPenarikan =
      penarikan.reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );

    const saldo =
      totalSimpanan -
      totalPenarikan;

    // ===========================
    // SUSUN 12 BULAN
    // ===========================

    const tahun =
      Number(req.query.tahun) ||
      new Date().getFullYear();

    const bulan = [];

    for (let i = 1; i <= 12; i++) {

      const periode =
        `${tahun}-${String(i).padStart(2,"0")}`;

      const existing =
        tagihan.find(
          item =>
            item.periode === periode
        );

      if (existing) {

        bulan.push(existing);

      } else {

        bulan.push({

          id: null,

          periode,

          nominal: 0,

          status: "belum_aktif",

          jatuh_tempo: null,

          tanggal_bayar: null

        });

      }

    }

    res.json({

      success: true,

      data: {

        anggota: user,

        saldo,

        total_simpanan:
          totalSimpanan,

        total_penarikan:
          totalPenarikan,

        bulan

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
// GET TAGIHAN USER (FLUTTER)
// ======================================
exports.getByUser = async (req, res) => {

  try {

    const { userId } = req.params;

    const {
      data,
      error
    } = await supabase
      .from("tagihan_simpanan_wajib")
      .select("*")
      .eq("user_id", userId)
      .order("jatuh_tempo", {
        ascending: true
      });

    if (error) throw error;

    res.json({

      success: true,

      data,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// SUMMARY TAGIHAN (FLUTTER DASHBOARD)
// ======================================
exports.getSummary = async (req, res) => {

  try {

    const { userId } = req.params;

    const {
      data,
      error
    } = await supabase
      .from("tagihan_simpanan_wajib")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    const belumBayar =
      data.filter(
        item =>
          item.status ===
          "belum_bayar"
      );

    const lunas =
      data.filter(
        item =>
          item.status ===
          "lunas"
      );

    const totalTunggakan =
      belumBayar.reduce(
        (sum, item) =>
          sum + Number(item.nominal),
        0
      );

    res.json({

      success: true,

      data: {

        jumlah_bulan:
          belumBayar.length,

        total_tunggakan:
          totalTunggakan,

        sudah_lunas:
          lunas.length,

        total_tagihan:
          data.length,

      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// ======================================
// GENERATE TAGIHAN BULANAN
// ======================================
exports.generateTagihan = async (req, res) => {

  try {

    const now = new Date();

    // ============================
    // AMBIL SETTING
    // ============================

    const {
      data: setting,
      error: settingError
    } = await supabase
      .from("setting_tagihan")
      .select("*")
      .eq("is_active", true)
      .single();

    if (settingError) throw settingError;

    if (!setting.generate_otomatis) {

      return res.status(400).json({

        success: false,

        message:
          "Generate otomatis sedang dinonaktifkan."

      });

    }

    // ============================

    const periode =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    const jatuhTempo = new Date(

      now.getFullYear(),

      now.getMonth(),

      setting.tanggal_jatuh_tempo

    );

    // ============================
    // AMBIL ANGGOTA AKTIF
    // ============================

    const {

      data: users,

      error: userError

    } = await supabase

      .from("users")

      .select("id")

      .eq("status", "approved");

    if (userError) throw userError;

    let totalGenerate = 0;

    for (const user of users) {

      const {

        data: existing

      } = await supabase

        .from("tagihan_simpanan_wajib")

        .select("id")

        .eq("user_id", user.id)

        .eq("periode", periode)

        .maybeSingle();

      if (!existing) {

        await supabase

          .from("tagihan_simpanan_wajib")

          .insert([{

            user_id:
              user.id,

            periode,

            nominal:
              setting.nominal,

            jatuh_tempo:
              jatuhTempo,

            status:
              "belum_bayar"

          }]);

          await createNotification({

            user_id: user.id,

            title: "Tagihan Baru",

            message:
              `Tagihan Simpanan Wajib periode ${periode} telah diterbitkan.`,

            category: "Tagihan",

            type: "tagihan",

            reference_id: null,

          });

        totalGenerate++;

      }

    }

    res.json({

      success: true,

      message:
        `${totalGenerate} tagihan berhasil dibuat.`

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

};

// ============================
// Aktifkan Tagihan
// ===========================
exports.aktifkanTagihan = async (
  req,
  res
) => {

  try {

    const {
      user_id,
      periode
    } = req.body;

    // cek setting

    const {
      data: setting
    } = await supabase

      .from("setting_tagihan")

      .select("*")

      .eq("is_active", true)

      .single();

    // cek apakah sudah ada

    const {
      data: existing
    } = await supabase

      .from("tagihan_simpanan_wajib")

      .select("id")

      .eq("user_id", user_id)

      .eq("periode", periode)

      .maybeSingle();

    if (existing) {

      return res.status(400).json({

        success:false,

        message:"Tagihan sudah aktif"

      });

    }

    const bulan =
      Number(
        periode.split("-")[1]
      );

    const tahun =
      Number(
        periode.split("-")[0]
      );

    const jatuhTempo =
      new Date(

        tahun,

        bulan - 1,

        setting.tanggal_jatuh_tempo

      );

    await supabase

      .from("tagihan_simpanan_wajib")

      .insert([{

        user_id,

        periode,

        nominal:
          setting.nominal,

        jatuh_tempo:
          jatuhTempo,

        status:
          "belum_bayar"

      }]);

      await createNotification({

        user_id,

        title: "Tagihan Diaktifkan",

        message:
          `Tagihan Simpanan Wajib periode ${periode} telah diaktifkan.`,

        category: "Tagihan",

        type: "tagihan",

      });

    res.json({

      success:true,

      message:"Tagihan berhasil diaktifkan"

    });

  } catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};

// ======================================
// APPROVE PEMBAYARAN TAGIHAN
// ======================================
exports.bayarTagihan = async (req, res) => {

  try {

    const { id } = req.params;

    // ============================
    // CEK TAGIHAN
    // ============================

    const {

      data: tagihan,

      error

    } = await supabase

      .from("tagihan_simpanan_wajib")

      .select("*")

      .eq("id", id)

      .single();

    if (error) throw error;

    if (tagihan.status === "lunas") {

      return res.status(400).json({

        success: false,

        message:
          "Tagihan sudah dibayar."

      });

    }

    // ============================
    // UPDATE STATUS
    // ============================

    await supabase

      .from("tagihan_simpanan_wajib")

      .update({

        status: "lunas",

        tanggal_bayar: new Date(),

        updated_at: new Date()

      })

      .eq("id", id);

    // ============================
    // MASUKKAN KE SIMPANAN
    // ============================

    await supabase

      .from("simpanan")

      .insert([{

        user_id:
          tagihan.user_id,

        jenis_simpanan:
          "Simpanan Wajib",

        nominal:
          tagihan.nominal,

        tanggal:
          new Date(),

        status:
          "aktif",

        keterangan:
          `Pembayaran Simpanan Wajib ${tagihan.periode}`

      }]);

      await createNotification({

        user_id: tagihan.user_id,

        title: "Tagihan Lunas",

        message:
          `Pembayaran Simpanan Wajib periode ${tagihan.periode} berhasil diverifikasi.`,

        category: "Transaksi",

        type: "tagihan",

        reference_id: tagihan.id,

      });

    res.json({

      success: true,

      message:
        "Pembayaran berhasil diverifikasi."

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
// STATUS TAGIHAN BULAN BERJALAN
// ======================================
exports.getStatus = async (req, res) => {

  try {

    const now = new Date();

    const periode =
      `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

    // Setting
    const {
      data: setting,
      error: settingError
    } = await supabase
      .from("setting_tagihan")
      .select("*")
      .eq("is_active", true)
      .single();

    if (settingError) throw settingError;

    // Apakah sudah pernah generate?
    const {
      data: tagihan
    } = await supabase
      .from("tagihan_simpanan_wajib")
      .select("id")
      .eq("periode", periode)
      .limit(1);

    res.json({

      success: true,

      data: {

        periode,

        nominal:
          setting.nominal,

        tanggal_generate:
          setting.tanggal_generate,

        jatuh_tempo:
          setting.tanggal_jatuh_tempo,

        generate_otomatis:
          setting.generate_otomatis,

        sudah_generate:
          tagihan.length > 0

      }

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

};