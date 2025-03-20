const express = require("express");
const router = express.Router();

router.get("/online", (req, res) => {
  res.status(200).json({ success: true, message: "Servidor en línea" });
});

module.exports = router;
