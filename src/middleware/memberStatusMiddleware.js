const supabase =
require("../config/supabase");

const checkMemberStatus =
async (req, res, next) => {

  try {

    const { user_id } = req.body;

    const { data, error } =
      await supabase
        .from("users")
        .select("status")
        .eq("id", user_id)
        .single();

    if (error) throw error;

    if (
      data.status !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Keanggotaan belum disetujui",
      });
    }

    next();

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports =
checkMemberStatus;