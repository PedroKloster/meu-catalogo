const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_catalogo',
    port: process.env.DB_PORT || 4000,
    ssl:{
        rejectUnauthorized: true
    }
});

db.connect((erro) => {
    if (erro) console.error('Erro ao conectar ao banco:', erro);
    else console.log('Conectado ao MySQL com sucesso!');
});

app.get('/itens', (req, res) => {
    db.query('SELECT * FROM itens', (erro, resultados) => {
        if (erro) return res.status(500).send('Erro ao buscar itens');
        res.json(resultados);
    });
});

app.post('/itens', (req, res) => {
    const { nome, categoria, descricao, nota, preco } = req.body;
    
    const descricaoFinal = descricao ? descricao : null;
    const notaFinal = nota ? nota : null;
    const precoFinal = preco ? preco : null;

    const sql = 'INSERT INTO itens (nome, categoria, descricao, nota, preco) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [nome, categoria, descricaoFinal, notaFinal, precoFinal], (erro, resultados) => {
        if (erro) {
            console.error(erro);
            return res.status(500).send('Erro ao cadastrar item');
        }
        res.json({ mensagem: 'Item cadastrado!', id: resultados.insertId });
    });
});

app.delete('/itens/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM itens WHERE id = ?', [id], (erro, resultados) => {
        if (erro) return res.status(500).send('Erro ao excluir item');
        res.send('Item excluído com sucesso!');
    });
});

const porta = process.env.PORT || 4000;
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
