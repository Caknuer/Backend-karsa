const supabase = require("../config/supabase");

// ======================================
// GET SETTING TAGIHAN
// ======================================
exports.getSetting = async (req, res) => {

  try {

    const {
      data,
      error
    } = await supabase
      .from("setting_tagihan")
      .select("*")
      .eq("is_active", true)
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

// ======================================
// UPDATE SETTING TAGIHAN
// ======================================
exports.updateSetting = async (req, res) => {

  try {

    const {

      nominal,
      tanggal_generate,
      tanggal_jatuh_tempo,
      generate_otomatis,
      is_active,

    } = req.body;

    const {
      data: setting
    } = await supabase
      .from("setting_tagihan")
      .select("id")
      .eq("is_active", true)
      .single();

    const {
      data,
      error
    } = await supabase
      .from("setting_tagihan")
      .update({

        nominal,
        tanggal_generate,
        tanggal_jatuh_tempo,
        generate_otomatis,
        is_active,
        updated_at: new Date(),

      })
      .eq("id", setting.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message:
        "Setting tagihan berhasil diperbarui",

      data,

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};