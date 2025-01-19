const express = require('express');
const router = express.Router();
const db = require('../db/db');

// --------------- POST: novo grupo --------------- //
router.post('/create-group', async (req, res) => {
    const { name, password, description, image } = req.body;
    
    if (!name || !password || !description) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
    try {
        // Verificar se o nome do grupo já existe
        const [rows] = await db.query('SELECT * FROM groups_ WHERE name = ?', [name]);
        if (rows.length > 0) {
            return res.status(409).json({ error: 'Já existe um grupo com esse nome.' });
        }

        // Inserir o novo grupo no banco
        const [result] = await db.query(
            'INSERT INTO groups_ (name, password, description, image) VALUES (?, ?, ?, ?)',
            [name, password, description, image || null]
        );

        const groupId = result.insertId; // Obter o ID do grupo recém-criado

        // Inserir o usuário na tabela groupUsers
        await db.query(
            'INSERT INTO groupUsers (userEmail, groupId, position) VALUES (?, ?, ?)',
            [req.session.email, groupId, 'Administrador']
        );

        res.status(201).json({ message: 'Grupo criado com sucesso e usuário adicionado ao grupo!' });
    } catch (error) {
        console.error('Erro ao criar grupo:', error);
        res.status(500).json({ error: 'Erro ao criar grupo.' });
    }
});

// --------------- POST: Entrar em um grupo --------------- //
router.post('/enter-group', async (req, res) => {
    const { groupName, groupPassword } = req.body;

    const userEmail = req.session.email;
    const position = 'Participante';

    try {
        // Checar existência do grupo
        const [rows_] = await db.query('SELECT * FROM groups_ WHERE name = ?', [groupName]);
        if (rows_.length < 1) {
            return res.status(409).json({ error: 'Nenhum grupo com o nome fornecido encontrado.' });
        }

        const [rows__] = await db.query('SELECT groupId FROM groups_ WHERE name = ?', [groupName]);
        const groupId = rows__[0].groupId;

        // Checar credenciais
        const [rows___] = await db.query('SELECT * FROM groups_ WHERE name = ? and password = ?', [groupName, groupPassword]);
        if (rows___.length < 1) {
            return res.status(409).json({ error: 'Senha incorreta.' });
        }

        // Verificar se o usuário já está no grupo
        const [rows____] = await db.query('SELECT * FROM groupUsers WHERE userEmail = ? AND groupId = ?', [userEmail, groupId]);
        if (rows____.length > 0) {
            return res.status(409).json({ error: 'Você já está nesse grupo.' });
        }

        // Inserir o usuário no grupo
        await db.query(
            'INSERT INTO groupUsers (userEmail, groupId, position) VALUES (?, ?, ?)',
            [userEmail, groupId, position]
        );

        res.status(201).json({ message: 'Usuário adicionado com sucesso ao grupo!' });
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        res.status(500).json({ error: 'Erro ao adicionar usuário.' });
    }
});

// --------------- GET: listar grupos do usuário logado --------------- //
router.get('/get-groups', async (req, res) => {
    try {
        const userEmail = req.session.email;

        if (!userEmail) {
            return res.status(400).json({ error: 'O e-mail do usuário é obrigatório.' });
        }

        // Consultar os grupos associados ao usuário
        const [rows] = await db.query(
            `SELECT g.groupId, g.name, g.description, g.image
             FROM groupUsers gu
             JOIN groups_ g ON gu.groupId = g.groupId
             WHERE gu.userEmail = ?`,
            [userEmail]
        );

        // Retornar os grupos encontrados
        res.status(200).json({ groups: rows });
    } catch (error) {
        console.error('Erro ao obter grupos:', error);
        res.status(500).json({ error: 'Erro ao obter grupos.' });
    }
});

// --------------- POST: Listar usuários pertencentes ao grupo selecionado --------------- //
router.post('/get-participants', async (req, res) => {
    const { groupId } = req.body;

    if (!groupId) {
        return res.status(400).json({ error: 'O ID do grupo não está sendo passado para a requisição de usuários do grupo.' });
    }

    try {
        // Consultar usuários pertencentes ao grupo
        const [rows] = await db.query(
            `SELECT u.username, u.email, u.level, g.position 
             FROM users AS u 
             JOIN groupUsers AS g ON g.userEmail = u.email 
             WHERE g.groupId = ?
             ORDER BY u.level DESC`,
            [groupId]
        );

        res.status(200).json({ groupUsers: rows });
    } catch (error) {
        console.error('Erro ao consultar usuários do grupo:', error);
        res.status(500).json({ error: 'Erro ao consultar usuários.' });
    }
});

// --------------- POST: Enviar mensagem no grupo atual --------------- //
router.post('/send-message', async (req, res) => {
    const { content, originGroupId, userSenderEmail } = req.body;
    const sendDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (!content) {
        return res.status(400).json({ error: 'Não é possível enviar uma mensagem em branco.' });
    }

    try {
        // Inserir mensagem no grupo
        await db.query(
            'INSERT INTO messages (content, sendDate, userSenderEmail, originGroupId) VALUES (?, ?, ?, ?)',
            [content, sendDate, userSenderEmail, originGroupId]
        );
    } catch (error) {
        console.error('Erro ao enviar mensagem no grupo:', error);
        res.status(500).json({ error: 'Erro ao enviar mensagem no grupo.' });
    }
});

// --------------- POST: Listar mensagens do grupo atual --------------- //
router.post('/get-messages', async (req, res) => {
    const { groupId } = req.body;

    if (!groupId) {
        return res.status(400).json({ error: 'O ID do grupo não está sendo passado para a requisição de mensagens do grupo.' });
    }

    try {
        // Consultar mensagens pertencentes ao grupo
        const [rows] = await db.query(
            `SELECT 
              m.content,
              m.sendDate,
              u.username
            FROM 
              messages AS m
            JOIN
              users AS u
            ON
              u.email = m.userSenderEmail
            WHERE
              originGroupId = ?
            ORDER BY
              sendDate
            `,
            [groupId]
        );

        res.status(200).json({ groupUsers: rows });
    } catch (error) {
        console.error('Erro ao consultar mensagens do grupo:', error);
        res.status(500).json({ error: 'Erro ao consultar mensagens.' });
    }
});

module.exports = router;