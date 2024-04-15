import express from 'express'
import doteenv from 'dotenv'
import jwt from 'jsonwebtoken'

doteenv.config()
const app = express()
app.use(express.json())

const port = process.env.port
const jwt_secret = process.env.secret

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwt_secret, (err, userData) => {
        if (err)
            return res.sendStatus(403);
        else {
            req.user = userData;
            next();
        }
    })
}


app.get('/api/login', (req, res) => {
    const user = req.body

    jwt.sign(user, jwt_secret,{expiresIn: '30s'}, (err, token) => {
        if (!err)
            res.send(token)
    })
})
app.get('/api/posts',authenticateToken, (req, res) => {
    res.send('Liste des posts')
})

app.post('/api/posts',authenticateToken, (req, res) => {
    res.send('Ajouter post')
})


app.listen(port)



