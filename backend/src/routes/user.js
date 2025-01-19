const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Rota POST para fazer login do usuario
router.post("/check-email", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      if (user.password === password) {
        req.session.email = email;
        return res.json({ exists: true, validPassword: true });
      } else {
        return res.json({ exists: true, validPassword: false });
      }
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    res.status(500).json({ error: "Erro ao verificar usuário." });
  }
});

// Rota POST para inserir um novo usuário
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, e-mail e senha são obrigatórios." });
  }

  try {
    // Verificar se já existe um usuário com o mesmo e-mail
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(409).json({ error: "E-mail já cadastrado." });
    }

    // Inserir o novo usuário
    await db.query(
      "INSERT INTO users (username, email, password, experience, level) VALUES (?, ?, ?, ?, ?)",
      [username, email, password, 0, 1]
    );

    res.status(201).json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

router.get("/check-session", (req, res) => {
  // Checa se existe usuário logado
  if (req.session.email) {
    return res.json({ loggedIn: true, email: req.session.email });
  } else {
    return res.json({ loggedIn: false });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao sair" });
    }
    res.clearCookie("connect.sid"); // Clear the session cookie
    res.json({ loggedIn: false, message: "Logout bem-sucedido" });
  });
});

router.get("/get-username", async (req, res) => {
  if (!req.session.email) {
    return res.status(401).json({ error: "Usuário não logado." });
  }

  try {
    const [rows] = await db.query(
      "SELECT username, experience, level, email FROM users WHERE email = ?",
      [req.session.email]
    );

    if (rows.length > 0) {
      return res.json({
        username: rows[0].username,
        level: rows[0].level,
        experience: rows[0].experience,
        useremail: rows[0].email
      });
    } else {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
});

module.exports = router;
