const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const authTokens = {};

const users = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        // This is the SHA256 hash for value of `password`
        password: 'XohImNooBHFR0OVvjcYpJ3NgPQ1qq73WKhHvch0VQtg='
    }
];

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

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
    if (!req.user) {
        return res.status(400).send("not logged in");
    }
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

const doLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    const user = users.find(u => {
        return u.email === email && hashedPassword === u.password
    });

    if (user) {
        const authToken = generateAuthToken();

        authTokens[authToken] = email;

        res.cookie('AuthToken', authToken);
        res.redirect('/');
    } else {
        res.cookie('AuthToken', null);
        res.status(400).send('bad combo');
    }
}

const doRegister = (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    if (password === confirmPassword) {
        if (users.find(user => user.email === email)) {

            res.status(400).send('user already registered');
            return;
        }

        const hashedPassword = getHashedPassword(password);

        users.push({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        res.status(201).send('Registration Complete. Please login to continue.');
    } else {
        res.status(400).send('passwords do not match');
    }
};

express()
  .use('/static', express.static(path.join(__dirname, 'public')))
  .use(express.static(path.join(__dirname, 'build')))
  .use(bodyParser.json())
  .use(cookieParser())
  .use((req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
    next();
  })
  .get('/login', (req, res) => res.send('login'))
  .post('/login', doLogin)
  .post('/register', doRegister)
  .get('/protected', (req, res) => {
    if (req.user) {
        res.send('protected');
    } else {
        res.status(403).send('Please login to continue');
    }
  })
  .post('/users', createUser)
  .post('/entries', createEntry)
  .get('/entries', getEntries) // TODO: check user
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
