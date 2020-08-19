const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const authTokens = {};

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

const getEntries = (req, res) => {
    pool.query('SELECT * FROM entries WHERE user_id = $1', [req.user], (error, results) => {
        if (error) {
            throw error
        }
        const d_results = { 'results': (results) ? results.rows : null};
        res.status(200).send(d_results);
    })
}

const createEntry = (req, res) => {
    if (!req.user) {
        return res.status(400).send("not logged in");
    }
    const {emotion, intensity, entry} = req.body;
    pool.query('INSERT INTO entries (emotion, intensity, entry, user_id) VALUES ($1, $2, $3, $4)',
            [emotion, intensity, entry, req.user], (error, results) => {
        if (error) {
            res.status(400).send("error");
            throw error
        }
        res.status(201).send({result: `Added ${results.rowCount} row(s)`});
    })
}

const doLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    getUserOrNull(email, hashedPassword).then(user => {
        if (user) {
            const authToken = generateAuthToken();

            authTokens[authToken] = user.id;

            res.cookie('AuthToken', authToken);
            res.redirect('/');
        } else {
            res.cookie('AuthToken', null);
            res.render('login', {
                message: 'Invalid username or password',
                messageClass: 'alert-danger'
            });
        }
    });
}

const getUserOrNull = (email, password) => {
    const userQuery = 'SELECT * FROM users WHERE email = $1' + (password ? ' AND password = $2' : '');
    const params = password ? [email, password] : [email];
    return pool.query(userQuery, params)
        .then(res => {
            if (res.rows.length) {
                return res.rows[0];
            }
            return null;
        })
        .catch(err =>
            setImmediate(() => {
                throw err
            })
        )
};

const doRegister = (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;

    if (password === confirmPassword) {
        getUserOrNull(email).then(user => {
            if (user) {
                res.render('register', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                });
                return;
            } else {
                const hashedPassword = getHashedPassword(password);
                writeNewUserToDB(email, firstName, hashedPassword).then(dbResult => {
                    const authToken = generateAuthToken();
                    authTokens[authToken] = email;
                    res.cookie('AuthToken', authToken);
                    res.redirect('/');
                });
            }
        })
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
};

const writeNewUserToDB = (email, firstName, hashedPassword) => {
    return pool.query('INSERT INTO users (email, first_name, password) VALUES ($1, $2, $3)',
            [email, firstName, hashedPassword])
        .then(res => {
            return true;
        })
        .catch(err =>
            setImmediate(() => {
                throw err;
            })
        );
};

express()
    .engine('hbs', exphbs({
        extname: '.hbs'
    }))
    .set('view engine', 'hbs')
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .get('/login', (req, res) => res.render('login'))
    .post('/login', doLogin)
    .get('/register', (req, res) => res.render('register'))
    .post('/register', doRegister)
    .use((req, res, next) => {
        const authToken = req.cookies['AuthToken'];
        req.user = authTokens[authToken];
        if (req.user) {
            next();
        } else {
            res.render('login', {
                message: 'Please login to continue',
                messageClass: 'alert-danger'
            });
        }
    })
    .use(express.static(path.join(__dirname, 'build')))
    .get('/entries', getEntries)
    .post('/entries', createEntry)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`))
