const express = require('express')
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
    pool.query('SELECT * FROM entries WHERE user_id = $1 ORDER BY id DESC', [req.user], (error, results) => {
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
            res.status(200).send({token: authToken});
        } else {
            res.cookie('AuthToken', null);
            res.status(400).send({msg: "invalid login"});
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
                res.status(400).send({msg: "passwords do not match"});
                return;
            } else {
                const hashedPassword = getHashedPassword(password);
                const authToken = generateAuthToken();
                writeNewUserToDB(email, firstName, hashedPassword).then(dbResult => {
                    console.log('this', dbResult);
                    const userId = dbResult.rows[0].id;
                    authTokens[authToken] = userId;
                    writeNewTokenToRedis(authToken, userId);
                    res.cookie('AuthToken', authToken);
                    res.status(201).send({token: authToken});
                }).catch(err => {
                    console.log('baaar');
                    console.log(err);
                    res.status(400).send({msg: "user could not be created"});
                });
            }
        })
    } else {
        res.status(400).send({msg: "passwords do not match"});
    }
};

const writeNewUserToDB = (email, firstName, hashedPassword) => {
    return pool.query('INSERT INTO users (email, first_name, password) VALUES ($1, $2, $3) RETURNING *',
            [email, firstName, hashedPassword])
        .then(res => res)
        .catch(err => {
            throw err;
        });
};

const validateUser = (req, res, next) => {
    let authToken = req.cookies['AuthToken'];
    const headerAuthString = req.headers.authorization;
    if (headerAuthString) {
        authToken = headerAuthString.split(" ")[1];
    }
    req.user = authTokens[authToken];
    console.log('token: ' + authToken);
    console.log('user: ' + req.user);
    if (req.user) {
        next();
    } else {
        res.status(401).send({msg: "unauthorized"});
    }
}

express()
    .use(cookieParser())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())
    .post('/login', doLogin)
    .post('/register', doRegister)
    .use(express.static(path.join(__dirname, 'build')))
    .use((req, res, next) => validateUser(req, res, next))
    .get('/entries', getEntries)
    .post('/entries', createEntry)
    .get('/users', getCurrentUserName)
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));
