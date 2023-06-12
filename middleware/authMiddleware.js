import JWT from "jsonwebtoken"
export default function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // const token = req.header("auth-token")
    if(!token) return res.status(401).send("Acess-denied")

    try {
        const verified = JWT.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send("Invalid access token")
    }
}