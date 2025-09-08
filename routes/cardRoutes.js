const express = require("express");
const { generateCardNumber, enrollCard, blockCard } = require("../controllers/cardController");
const { validateEnroll } = require("../validators/cardValidator");

const router = express.Router();

// Generar número de tarjeta
router.get("/:productId/number", generateCardNumber);

// Activar tarjeta
router.post("/enroll", validateEnroll, enrollCard);

// Bloquear tarjeta
router.delete("/:cardId", blockCard);

module.exports = router;
