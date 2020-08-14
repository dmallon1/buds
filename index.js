const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const bodyParser = require('body-parser')


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createUser = (request, response) => {
    const { name } = request.body

    pool.query('INSERT INTO test_table (name) VALUES ($1)', [name], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        response.status(201).send(`User added with ID: ${results.rows}`)
    })
}

const getEntries = (req, res) => {
    pool.query('SELECT * FROM entries ', (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        const d_results = { 'results': (results) ? results.rows : null};
        res.status(200).send(d_results);
    })
}

const createEntry = (req, res) => {
    const {emotion, intensity, entry} = req.body;
    pool.query('INSERT INTO entries (emotion, intensity, entry) VALUES ($1, $2, $3)',
            [emotion, intensity, entry], (error, results) => {
        if (error) {
            res.status(400).send("error");
            throw error
        }
        console.log(results)
        res.status(201).send(`Added ${results.rowCount} row(s)`);
    })
}

express()
  .use('/static', express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'build')))
  .use(bodyParser.json())
  .use(
    bodyParser.urlencoded({
        extended: true,
    })
   )
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .post('/users', createUser)
  .post('/entries', createEntry)
  .get('/entries', getEntries)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
