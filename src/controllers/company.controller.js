const supabase = require("../config/supabase");

// GET COMPANY PROFILE
exports.getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("company_profile")
      .select("*")
      .limit(1)
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

// UPDATE COMPANY PROFILE
exports.updateProfile = async (req, res) => {
  try {

    const {
      nama_koperasi,
      slogan,
      deskripsi,
      visi,
      misi,
      tahun_berdiri,
      alamat,
      telepon,
      email,
      website,
      logo_url,
      banner_url,
      foto_kantor_url,
      latitude,
      longitude,
      maps_url,
      jam_operasional
    } = req.body;

    const { data: existing } = await supabase
      .from("company_profile")
      .select("id")
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from("company_profile")
      .update({
        nama_koperasi,
        slogan,
        deskripsi,
        visi,
        misi,
        tahun_berdiri,
        alamat,
        telepon,
        email,
        website,
        logo_url,
        banner_url,
        foto_kantor_url,
        latitude,
        longitude,
        maps_url,
        jam_operasional,
        updated_at: new Date(),
      })
      .eq("id", existing.id)
      .select()
      .single();
      
    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Profil koperasi berhasil diperbarui",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};