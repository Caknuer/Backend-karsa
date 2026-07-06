const supabase = require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

exports.getAllAnnouncements = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
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

exports.getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
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

exports.createAnnouncement = async (req, res) => {
  try {
    const {
      judul,
      konten,
      gambar_url,
    } = req.body;

    const { data, error } = await supabase
      .from("announcements")
      .insert([
        {
          judul,
          konten,
          gambar_url,
        },
      ])
      .select();

    if (error) throw error;

    const announcement = data[0];

      const {
        data: users,
        error: usersError,
      } = await supabase
        .from("users")
        .select("id")
        .eq("status", "approved");

      if (usersError) throw usersError;

      for (const user of users) {

        await createNotification({

          user_id: user.id,
          title: "Pengumuman Baru",
          message: announcement.judul,
          category: "Pengumuman",
          type: "announcement",
          reference_id: announcement.id,
        });
      }

    res.status(201).json({
      success: true,
      data,
      message: "Pengumuman berhasil ditambahkan",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      judul,
      konten,
      gambar_url,
      is_active,
    } = req.body;

    const { data, error } = await supabase
      .from("announcements")
      .update({
        judul,
        konten,
        gambar_url,
        is_active,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: "Pengumuman berhasil diperbarui",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Pengumuman berhasil dihapus",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};