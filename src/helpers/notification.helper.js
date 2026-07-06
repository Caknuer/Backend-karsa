const supabase =
require("../config/supabase");

exports.createNotification =
async ({

  user_id,

  title,

  message,

  category,

  type,

  reference_id = null,

}) => {

  try {

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

      ]);

  } catch (error) {

    console.log(
      "NOTIFICATION ERROR",
      error.message,
    );

  }

};