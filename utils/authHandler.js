let jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../public.key'), 'utf8');
let userController = require("../controllers/users")
module.exports = {
    checkLogin: async function (req, res, next) {
        try {
            let token = req.headers.authorization;
            if (!token || !token.startsWith('Bearer')) {
                res.status(404).send("ban chua dang nhap")
            }
            token = token.split(" ")[1];
            let result = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
            if (result.exp * 1000 > Date.now()) {
                let user = await userController.FindUserById(result.id);
                if (user) {
                    req.user = user
                    next()
                } else {
                    res.status(404).send("ban chua dang nhap")
                }
            } else {
                res.status(404).send("ban chua dang nhap")
            }
        } catch (error) {
            res.status(404).send("ban chua dang nhap")
        }
    }
}