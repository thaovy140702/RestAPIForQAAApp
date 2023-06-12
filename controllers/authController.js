import bcrypt from "bcrypt";
import User from "../models/User.js";
import { loginValidation, registerValidation } from "../validation";
import JWT from "jsonwebtoken"

// register
export const register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).json({ user: savedUser });
  } catch (err) {
    res.status(400).json({ status: "Failed", message: err });
  }
};

// login
let refreshTokens = []

export const login = async (req, res) => {
  const { error } = loginValidation(req.data);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email");

  const validPassWord = await bcrypt.compare(req.body.password, user.password);
  if(!validPassWord) return res.status(400).json({ mess: "Invalid password"})

  const token = generateAccessToken({ _id: user._id})
  const refreshToken = JWT.sign({ _id: user._id}, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken)
  res.status(200).json({ message: "Login successfully", accessToken: token, refreshToken: refreshToken, user})

};

// generate access token
export const generateAccessToken = (user) => {
  return JWT.sign(user, process.env.TOKEN_SECRET, { expiresIn: '15s'})
}

// get new access token when access token was expired
export const newAccessToken = (req, res) => {
  const refreshToken = req.body.token
  if( refreshToken == null) return res.sendStatus(401)
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ _id: user._id })
    res.json({ accessToken: accessToken})
  })

}

// logout
export const logout = (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
}