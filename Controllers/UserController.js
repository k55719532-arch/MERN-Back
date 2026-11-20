// UserModel-a kandupudikka try pannu - Models / Model rendu-um work aagum
let User;
try {
  User = require("../Models/UserModel");
} catch (e) {
  User = require("../Model/UserModel");
}

let bcrypt;
try {
  bcrypt = require("bcryptjs");
} catch (e) {
  bcrypt = null;
}

// SIGNUP
const SignupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields!" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters!" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please Login." });
    }

    // bcrypt irundha hash pannu, illana apdiye save pannu
    let finalPassword = password;
    if (bcrypt) {
      finalPassword = await bcrypt.hash(password, 10);
    }

    const newUser = new User({
      username: username,
      email: email,
      password: finalPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "Account Created Successfully!",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter Email and Password!" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User not found! Please Signup first." });
    }

    let isMatch = false;
    if (bcrypt) {
      // bcrypt-la hash pannina password-a compare pannu
      // Pazhaya user-ku plain password-a irundha, adha-um check pannu
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        isMatch = false;
      }
      if (!isMatch && password === user.password) {
        isMatch = true;
      }
    } else {
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

    res.status(200).json({
      message: "Login Success!",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { SignupUser, LoginUser };