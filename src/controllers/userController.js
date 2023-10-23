const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = require("../secrets.json").secretKey;
const rounds = require("../secrets.json").rounds;

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const hashedPassword = await bcrypt.hash(password, rounds);
    const user = await User.create({ username, password: hashedPassword });
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1d" });
    res.status(201).json({ token });
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return error(401,"Invalid Credentials");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return error(401,"Invalid Credentials");
    }
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1d" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: "Login failed" });
  }

};

function error(status,message) {
  return res.status(status).json({ message: message });
}

module.exports = { register, login };
