const fileModel = require("../models/fileModel");

const router = require("express").Router();

router.get("/:uuid", async function (req, res) {
  try {
    const file = await fileModel.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link expired" });
    }

    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
  } catch (error) {
    return res.render("download", { error: "Something went Wrong" });
  }
});

module.exports = router;
