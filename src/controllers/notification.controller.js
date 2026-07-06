const supabase =
require("../config/supabase");

// =========================
// GET ALL NOTIFICATION
// =========================
exports.getMyNotifications = async (req, res) => {

  try {

    const uid = req.user.uid;

    const { data: user } =
      await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", uid)
        .single();

    const { data, error } =
      await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
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

// =========================
// CREATE NOTIFICATION
// =========================
exports.create = async (req, res) => {

  try {

    const {

      user_id,

      title,

      message,

      category,

      type,

      reference_id,

    } = req.body;

    const { data, error } =
      await supabase
        .from("notifications")
        .insert([

          {

            user_id,

            title,

            message,

            category,

            type,

            reference_id,

          },

        ])
        .select();

    if (error) throw error;

    res.status(201).json({

      success: true,

      data,

      message:
        "Notifikasi berhasil dibuat",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};

// =========================
// MARK AS READ
// =========================
exports.markAsRead = async (req, res) => {

  try {

    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("notifications")
        .update({

          is_read: true,

        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    res.json({

      success: true,

      data,

      message: "Notifikasi telah dibaca",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

// =========================
// MARK ALL AS READ
// =========================
exports.markAllAsRead = async (req, res) => {

  try {

    const uid = req.user.uid;

    const { data: user, error: userError } =
      await supabase
        .from("users")
        .select("id")
        .eq("firebase_uid", uid)
        .single();

    if (userError) throw userError;

    const { data, error } =
      await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false)
        .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Semua notifikasi dibaca",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};