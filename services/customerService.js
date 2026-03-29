const db = require("../db/db");
const AppError = require("../utils/AppError");

/**
 * @param {Object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string|null} options.email
 * @returns {Array}
 */

exports.getAll = ({ page = 1, limit = 10, email = null }) => {
    const offset = (page - 1) * limit;

    let query = `
SELECT id, name, email, phone, registeredAt
FROM customers
`;

    const params = [];

    if (email) {
        query += " WHERE email = ?";
        params.push(email.trim());
    }

    query += " ORDER BY registeredAt DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const stmt = db.prepare(query);
    return stmt.all(...params);
};

/**
 * @param {number|string} id
 * @returns {Object|null}
 */

exports.getById = (id) => {
    const stmt = db.prepare(`
    SELECT id, name, email, phone, registeredAt
    FROM customers
    WHERE id = ?
    `);

    return stmt.get(id);
};

/**
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @returns {Object}
 * throws AppError if email already exists
 */

exports.create = (data) => {
  const { name, email, phone } = data;

  const existing = db
    .prepare("SELECT id FROM customers WHERE email = ?")
    .get(email);
  if (existing) {
    throw new AppError("Клиент с таким email уже существует", 400);
  }

  const insertStmt = db.prepare("INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)");
  const info = insertStmt.run(name, email, phone);

  const newCustomer = db
    .prepare(
      `SELECT id, name, email, phone, registeredAt
    FROM customers
    WHERE id = ?`
    )
    .get(info.lastInsertRowid);

  return newCustomer;
};

/**
 * @param {number} id
 * @param {Object} data
 */
exports.update = (id, data) => {
  const { name, email, phone } = data;

  const updates = [];
  const params = [];

  if (name) {
    updates.push("name = ?");
    params.push(name);
  }

  if (email) {
    const existing = db
      .prepare("SELECT id FROM customers WHERE email = ? AND id != ?")
      .get(email, id);

    if (existing) {
      throw new AppError("Клиент с таким email уже существует", 400);
    }
    updates.push("email = ?");
    params.push(email);
  }

  if (phone) {
    updates.push("phone = ?");
    params.push(phone);
  }

  if (!updates.length) {
    throw new AppError("Не указаны поля для обновления", 400);
  }

  params.push(id);

  const stmt = db.prepare(
    `UPDATE customers
    SET ${updates.join(", ")}
    WHERE id = ?`
  );

  const info = stmt.run(...params);

  if (info.changes === 0) {
    throw new AppError("Клиент не найден", 404);
  }

  return exports.getById(id);
};

/**
 * @param {number} id
 */
exports.delete = (id) => {
  const customer = db.prepare("SELECT id FROM customers WHERE id = ?").get(id);
  if (!customer) {
    throw new AppError("Клиент не найден", 404);
  }

  const hasOrders = db
  .prepare("SELECT 1 FROM orders WHERE customerId = ?")
    .get(id);
  if (hasOrders) {
    throw new AppError(
      "Невозможно удалить клиента с активными заказами",
      409,
    );
  }
  db.prepare("DELETE FROM customers WHERE id = ?").run(id);
};