const express = require('express');
const server = express();

server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

// Banco de dados
const Pool = require('pg').Pool;
const db = new Pool({
  user: 'postgres',
  password: '0000',
  host: 'localhost',
  port: '5432',
  database: 'donation'
});


const nunjucks = require('nunjucks');
nunjucks.configure('./', {
  express: server,
  noCache: true,
});

server.get('/', (req, res) => {

  db.query("SELECT * FROM donors", (err, result) => {
    if (err) return res.send(`<script>
    alert("Erro de banco de dados.");
    window.location.href = "/";
    </script>`);

    const donors = result.rows;
    return res.render('index.html', { donors });
  })
});

server.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == "" || email == "" || blood == "") {
    return res.send(`<script>
    alert("Todos os campos são obrigatórios.");
    window.location.href = "/";
    </script>`);
  }

  const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)
  `
  const values = [name, email, blood];

  db.query(query, values, err => {
    if (err) return res.send(`<script>
      alert('erro no banco de dados');
      window.location.href = "/";
      </script>
    `);
    return res.redirect('/');
  });
});

server.listen(3000);
