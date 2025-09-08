const Card = require("../models/cardModel");

// 🔹 Generar tarjeta
exports.generateCardNumber = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!/^\d{6}$/.test(productId)) {
      return res.status(400).json({ error: "El productId debe tener exactamente 6 dígitos." });
    }

    const randomDigits = Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
    const cardId = productId + randomDigits;

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 3);

    const card = await Card.create({
      cardId,
      productId,
      expirationDate: `${expirationDate.getMonth() + 1}/${expirationDate.getFullYear()}`,
    });

    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

// 🔹 Activar tarjeta
exports.enrollCard = async (req, res, next) => {
  try {
    const { cardId } = req.body;

    const card = await Card.findOne({ cardId });
    if (!card) return res.status(404).json({ error: "Tarjeta no encontrada" });

    if (card.status === "BLOCKED")
      return res.status(400).json({ error: "La tarjeta está bloqueada y no puede activarse" });

    card.status = "ACTIVE";
    await card.save();

    res.json({ message: "Tarjeta activada con éxito", card });
  } catch (err) {
    next(err);
  }
};

// 🔹 Bloquear tarjeta
exports.blockCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findOne({ cardId });
    if (!card) return res.status(404).json({ error: "Tarjeta no encontrada" });

    card.status = "BLOCKED";
    await card.save();

    res.json({ message: "Tarjeta bloqueada con éxito", card });
  } catch (err) {
    next(err);
  }
};
