const supabase = require("../config/supabase");

const {
  createNotification,
} = require(
  "../helpers/notification.helper"
);

exports.getAllNews = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("is_active", true)
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

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("news")
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

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      judul,
      konten,
      penulis,
      gambar_url,
      is_active,
    } = req.body;

    const { data, error } = await supabase
      .from("news")
      .update({
        judul,
        konten,
        penulis,
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
      message: "Berita berhasil diperbarui",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Berita berhasil dihapus",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//ADMIN
exports.createNews = async (req, res) => {
  try {
    const {
      judul,
      konten,
      penulis,
      gambar_url,
      kategori,
    } = req.body;

    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          judul,
          konten,
          penulis,
          gambar_url,
          kategori,
        },
      ])
      .select();

    if (error) throw error;

    const news = data[0];

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
        title: "Berita Baru",
        message: news.judul,
        category: "Berita",
        type: "news",
        reference_id: news.id,
      });
    }

    res.status(201).json({
      success: true,
      data,
      message: "Berita berhasil ditambahkan",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};