const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Criação de task (Fazer notificacao ser global a todos os usuarios depois!)
router.post("/create-task", async (req, res) => {
  const { description, reward, groupID } = req.body;
  const sendDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!description || !reward || !groupID) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (reward > 100) {
    return res.status(400).json({ error: "Recompensa até 100 pontos" });
  }
  try {
    //Adicionar task no grupo geral
    let query =
      "INSERT INTO tasks (description,reward,originGroupId,createDate) VALUES (?,?,?,?)";
    const [result] = await db.query(query, [
      description,
      reward,
      groupID,
      sendDate,
    ]);
    taskID = result.insertId;

    //Adicionar a task para todos os usuarios do grupo
    query = `SELECT u.email 
        FROM groupUsers as gu
        JOIN users as u ON gu.userEmail = u.email
        WHERE gu.groupId = ? `;
    const [rows] = await db.query(query, [groupID]);
    for (let i = 0; i < rows.length; ++i) {
      query = `INSERT INTO taskAssignment (assignedUser,taskId,concluded) VALUES (?,?,?)`;
      await db.query(query, [rows[i].email, taskID, false]);
    }

    res.status(200).json({ message: "Sucesso ao criar task" });
  } catch (error) {
    res.status(500).json({ error: "Houve um erro ao criar task" });
  }
});

//Task concluida
router.post("/task-concluded", async (req, res) => {
  const { taskID, reward } = req.body;
  const userEmail = req.session.email;

  console.log(req.body);
  console.log(taskID);
  console.log(userEmail);
  console.log(reward);

  if (!taskID || !userEmail || !reward) {
    return res.status(400).json({ error: "Todos os campos são obrigatorios" });
  }
  try {
    //Checa se tarefa ja esta concluida
    let query =
      "SELECT concluded FROM taskAssignment WHERE taskId = ? AND assignedUser = ?";
    const [exist] = await db.query(query, [taskID, userEmail]);
    if (exist[0].concluded) {
      return res.status(200).json({ message: "Tarefa já concluida" });
    }

    //Insere na lista de tasks concluidas do usuario
    query =
      "UPDATE taskAssignment SET concluded = ? WHERE taskId = ? AND assignedUser = ?";
    await db.query(query, [true, taskID, userEmail]);

    //Adiciona a recompensa ao usuario
    query = `SELECT experience, level FROM users WHERE email = ?`;
    const [user] = await db.query(query, [userEmail]);
    if (!user.length) {
      return res.status(400).json({ error: "Usuario não encontrado" });
    }

    const experience = user[0].experience;
    const totalExperience = Number(experience) + Number(reward);

    if (totalExperience >= 100) {
      //Upa de nivel
      query =
        "UPDATE users SET experience = ?, level = level + 1 WHERE email = ?";
      await db.query(query, [totalExperience - 100, userEmail]);
    } else {
      //Mantem nivel
      query = "UPDATE users SET experience = ? WHERE email = ?";
      await db.query(query, [totalExperience, userEmail]);
    }

    res.status(200).json({ message: "Sucesso ao concluir task" });
  } catch (error) {
    res.status(500).json({ error: "Houve um erro a concluir uma task" });
  }
});

//Checka se o usuario é administrador
router.get("/check-adm", async (req, res) => {
  const { groupID } = req.query;
  const userEmail = req.session.email;

  if (!groupID || !userEmail) {
    return res.status(400).json({ error: "Todos os campos são obrigatorios" });
  }
  try {
    let query =
      "SELECT position FROM groupUsers WHERE userEmail = ? AND groupId = ?";
    const [rows] = await db.query(query, [userEmail, groupID]);
    if (!rows.length) {
      return res.status(400).json({ error: "Usuário não encontrado no grupo" });
    }

    const position = rows[0].position;
    res.status(200).json({ position: position });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Houve um erro ao checar status do usuario" });
  }
});

//Pega as tasks do usuario
router.get("/get-tasks", async (req, res) => {
  const { groupID } = req.query;
  const userEmail = req.session.email;
  if (!groupID || !userEmail) {
    return res
      .status(400)
      .json({ error: "Todos os campos devem ser obrigatorios" });
  }
  try {
    //Pega todas as tasks do grupo do usuario
    let query = `SELECT t.description, t.reward, ta.concluded, t.taskId
        FROM tasks AS t
        JOIN taskAssignment AS ta ON ta.taskId = t.taskId
        WHERE t.originGroupId = ? AND ta.assignedUser = ?`;
    const [rows] = await db.query(query, [groupID, userEmail]);
    res.status(200).json({ tasks: rows || [] });
  } catch (error) {
    res.status(500).json({ error: "Houve ume erro ao coletar todas tasks" });
  }
});

module.exports = router;
