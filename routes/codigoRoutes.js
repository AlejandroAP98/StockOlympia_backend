const express = require("express");
const  authenticateJWT  = require("../middleware/auth"); // Middleware de autenticación
const codigoController = require("../controllers/codigoController");

const router = express.Router();

router.get("/codigos", authenticateJWT, codigoController.getAllCodigos);
router.post("/codigos", authenticateJWT, codigoController.createCodigo);
router.delete("/codigos/:id", authenticateJWT, codigoController.deleteCodigo);

module.exports = router;
