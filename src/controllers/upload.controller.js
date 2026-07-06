const supabase = require("../config/supabase");
const { v4: uuidv4 } = require("uuid");

exports.uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File tidak ditemukan",
      });
    }

    console.log("FILE NAME:", req.file.originalname);
    console.log("MIME:", req.file.mimetype);

    const ext =
      req.file.originalname.split(".").pop();

    const fileName =
      `${uuidv4()}.${ext}`;

    const { error } = await supabase
      .storage
      .from("karsa")
      .upload(
        `images/${fileName}`,
        req.file.buffer,
        {
          contentType: req.file.mimetype,
        }
      );

    if (error) {
      console.log("UPLOAD ERROR:");
      console.log(error);
      throw error;
    }

    const { data } = supabase
      .storage
      .from("karsa")
      .getPublicUrl(
        `images/${fileName}`
      );

    res.json({
      success: true,
      url: data.publicUrl,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};