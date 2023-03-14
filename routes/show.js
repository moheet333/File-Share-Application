const fileModel = require("../models/fileModel");
const router = require("express").Router();

router.get("/:uuid", async function (req, res) {
  try {
    const file = await fileModel.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link expired" });
    }

    res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
    });
  } catch (error) {
    return res.render("download", { error: "Something went wrong" });
  }
});

module.exports = router;
