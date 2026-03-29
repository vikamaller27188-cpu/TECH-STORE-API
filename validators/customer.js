const { body, param } = require("express-validator");
const config = require("../config");

const createCustomer = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Имя обязательно")
    .isLength({ min: config.MIN_NAME_LENGTH, max: config.MAX_NAME_LENGTH })
    .withMessage(
      "Имя должно быть от ${config.MIN_NAME_LENGTH} до ${config.MAX_NAME_LENGTH} символов",
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email обязателен")
    .isEmail()
    .withMessage("Некорректный формат email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Телефон обязателен")
    .matches(config.DEFAULT_PHONE_REGEX)
    .withMessage("Телефон должен быть в формате +7(XXX)XXX-XX-XX"),
];

const updateCustomer = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: config.MIN_NAME_LENGTH, max: config.MAX_NAME_LENGTH })
    .withMessage(
      "Имя должно быть от ${config.MIN_NAME_LENGTH} до ${config.MAX_NAME_LENGTH} символов",
    ),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Некорректный формат email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(config.DEFAULT_PHONE_REGEX)
    .withMessage("Телефон должен быть в формате +7(XXX)XXX-XX-XX"),
    
  param("id")
    .isInt({ min: 1 })
    .withMessage("ID должен быть положительным целым числом"),
];

module.exports = {
  createCustomer,
  updateCustomer,
};