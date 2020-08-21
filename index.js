const express = require('express')
const exphbs = require('express-handlebars');
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function(error) {
  console.error(error);
});

const authTokens = {};

client.lrange('auth_tokens', 0, -1, (err, token_keys) => {
    if (err) throw err;
    client.mget(token_keys, (err, userIds) => {
        if (err) throw err;
        userIds.forEach((userId, i) => {
            authTokens[token_keys[i]] = userId;
        });
    });
});

const writeNewTokenToRedis = (token, userId) => {
    client.lpush('auth_tokens', token, (err, res) => {
        if (err) console.log(err);
    });
    client.set(token, userId, (err, res) => {
        if (err) console.log(err);
    });
};

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
    const {emotion, intensity, entry} = req.body;
    if (entry === '') {
        res.status(400).send({result: "empty entry"});
        return;
    }
    pool.query('INSERT INTO entries (emotion, intensity, entry, user_id) VALUES ($1, $2, $3, $4)',
            [emotion, intensity, entry, req.user], (error, results) => {
        if (error) {
            res.status(400).send({result: "error"});
            throw error
        }
        res.status(201).send({result: `Added ${results.rowCount} row(s)`});
    })
}

const getCurrentUserName = (req, res) => {
    pool.query('SELECT first_name FROM users WHERE id = $1', [req.user], (error, results) => {
        if (error) throw error;
        res.status(200).send(results.rows[0]);
    });
};

const doLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    getUserOrNull(email, hashedPassword).then(user => {
        if (user) {
            const authToken = generateAuthToken();

            authTokens[authToken] = user.id;
            writeNewTokenToRedis(authToken, user.id);
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
    const { email, firstName, password, confirmPassword } = req.body;

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
                const authToken = generateAuthToken();
                writeNewUserToDB(email, firstName, hashedPassword).then(dbResult => {
                    const userId = dbResult.rows[0].id;
                    authTokens[authToken] = userId;
                    writeNewTokenToRedis(authToken, userId);
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
    return pool.query('INSERT INTO users (email, first_name, password) VALUES ($1, $2, $3) RETURNING *',
            [email, firstName, hashedPassword])
        .then(res => res)
        .catch(err =>
            setImmediate(() => {
                throw err;
            })
        );
};

const validateUser = (req, res, next) => {
    const authToken = req.cookies['AuthToken'];
    req.user = authTokens[authToken];
    console.log('token: ' + authToken);
    console.log('user: ' + req.user);
    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: 'Please login to continue',
            messageClass: 'alert-danger'
        });
    }
}

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
    .use((req, res, next) => validateUser(req, res, next))
    .use(express.static(path.join(__dirname, 'build')))
    .get('/entries', getEntries)
    .post('/entries', createEntry)
    .get('/users', getCurrentUserName)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
