const supabase = require("../config/supabase");
const admin = require("../config/firebase");

//Test Admin
exports.firebaseTest = async (req, res) => {
  try {
    const user = await admin.auth().getUserByEmail(
      "test@gmail.com"
    );

    res.json({
      uid: user.uid,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//Register
exports.register = async (req, res) => {
  try {
    const data = req.body;

    const { data: existingEmail, error: emailError, } = await supabase
      .from("users")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();

    if (emailError) {
      throw emailError;
    }

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan",
      });
    }

    const { data: existingUsername } = await supabase
      .from("users")
      .select("id")
      .eq("username", data.username)
      .maybeSingle();

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan",
      });
    }

    const { data: existingNik } = await supabase
      .from("users")
      .select("id")
      .eq("nik", data.nik)
      .maybeSingle();

    if (existingNik) {
      return res.status(400).json({
        success: false,
        message: "NIK sudah terdaftar",
      });
    }

    const { data: result, error } = await supabase
      .from("users")
      .insert([
        {
          firebase_uid: data.firebase_uid,
          nama: data.nama,
          nik: data.nik,
          email: data.email,
          no_hp: data.noHp,
          alamat: data.alamat,

          jenis_kelamin: data.jenisKelamin,
          tempat_lahir: data.tempatLahir,
          tanggal_lahir: data.tanggalLahir,
          pekerjaan: data.pekerjaan,

          tipe_keanggotaan: data.tipeKeanggotaan,
          username: data.username,
          foto_ktp_url: data.fotoKtpUrl,

          role: "anggota",
          status: "pending",
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      data: result,
      message: "Registrasi berhasil",
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

//Protected
exports.protected = async (req, res) => {
  res.json({
    success: true,
    message: "Token valid",
    user: req.user,
  });
};

//profile
exports.profile = async (req, res) => {
  try {
    console.log("USER TOKEN:", req.user);

    const uid = req.user.uid;

    console.log(
      "UID FIREBASE:",
      uid
    );

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("firebase_uid", uid)
      .maybeSingle();
      
    console.log(
      "HASIL QUERY:",
      data
    );

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {

    const uid = req.user.uid;

    const {
      nama,
      no_hp,
      alamat,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      pekerjaan,
      foto_profile_url,
    } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        nama,
        no_hp,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        pekerjaan,
        foto_profile_url,
        updated_at: new Date(),
      })
      .eq("firebase_uid", uid)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message:
        "Profil berhasil diperbarui",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// UPDATE FCM TOKEN
// =====================================
exports.updateFcmToken = async (req, res) => {

  try {

    const uid = req.user.uid;

    const { fcm_token } = req.body;

    const { data, error } =
      await supabase
        .from("users")
        .update({

          fcm_token,

          updated_at: new Date(),

        })
        .eq("firebase_uid", uid)
        .select()
        .single();

    if (error) throw error;

    res.json({

      success: true,

      data,

      message: "FCM Token berhasil diperbarui",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};