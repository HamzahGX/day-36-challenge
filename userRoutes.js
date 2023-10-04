const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

// Sample array for storing user data
const users = [];

// Registration form validation rules
const registrationValidationRules = [
  check('username').not().isEmpty().trim().escape(),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

// Register a new user
router.post('/register', registrationValidationRules, (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  // Check if the username already exists
  if (users.some((user) => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const newUser = { username, password: hashedPassword };
    users.push(newUser);


    return res.status(201).json({ message: 'User registered successfully' });
  });
});

// Login route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle any error that may occur during logout
      console.error(err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    // Successful logout
    res.redirect('/login');
  });
});

module.exports = router;
