const supabase = require("../config/supabase");

// GET
exports.getLegality = async (req, res) => {
  try {

    const { data, error } = await supabase
      .from("legalities")
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

// UPDATE
exports.updateLegality = async (req, res) => {
  try {

    const {
      nomor_badan_hukum,
      nomor_nib,
      nomor_npwp,
      tanggal_berdiri,
      dokumen_url
    } = req.body;

    const { data: existing } = await supabase
      .from("legalities")
      .select("id")
      .limit(1)
      .single();

    const { data, error } = await supabase
      .from("legalities")
      .update({
        nomor_badan_hukum,
        nomor_nib,
        nomor_npwp,
        tanggal_berdiri,
        dokumen_url,
        updated_at: new Date(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Legalitas berhasil diperbarui",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};