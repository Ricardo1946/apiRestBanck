const { body, validationResult } = require("express-validator");

exports.validateEnroll = [
  body("cardId").isLength({ min: 16, max: 16 }).withMessage("El cardId debe tener 16 dígitos."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
