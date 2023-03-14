const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fileModel = require("../models/fileModel");
const { v4: uuid4 } = require("uuid");
const sendMail = require("../services/emailService");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random() * 1e9}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 100 },
}).single("nameAttribute");

router.post("/", function (req, res) {
  upload(req, res, async (err) => {
    if (!req.file) {
      return res.json({ error: "Files are allowed!" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    const file = new fileModel({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async function (req, res) {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All fiends are required" });
  }
  const file = await fileModel.findOne({ uuid: uuid });
  if (file.sender) {
    return res.status(422).send({ error: "Email already sent." });
  }
  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Inshare file sharing",
    text: `${emailFrom} shared a file with you`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours",
    }),
  });

  return res.send({ success: "True" });
});

module.exports = router;
