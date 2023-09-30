const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 3000;

// Data Structure for Users
const users = [
  {
    id: 1,
    username: 'user1',
    password: '$2b$10$02VKyd5C0Gd0lUUDXB2Z..FMrYYunXDN14KNPzVZ7WkWsSgI0kmG2', // Hashed password for 'password1'
  },
  {
    id: 2,
    username: 'user2',
    password: '$2b$10$6ePvKBK3.s.ROZLobnMCUOJJ1Hsz2H0IKZTVtw2DgOpn.Vt7pm3RO', // Hashed password for 'password2'
  },
];

// Data Structure for Blog Posts
const blogPosts = [
  {
    id: 1,
    title: 'Getting Started with Express.js',
    content: 'Express.js is a minimal and flexible Node.js web application framework...',
    author: 'user1',
    date: '2023-01-15',
  },
  {
    id: 2,
    title: 'Introduction to RESTful APIs',
    content: 'REST (Representational State Transfer) is an architectural style for designing networked applications...',
    author: 'user2',
    date: '2023-02-20',
  },
  {
    id: 3,
    title: 'Node.js Best Practices',
    content: 'Node.js is a powerful platform for building server-side applications, but it comes with its own set of best practices...',
    author: 'user1',
    date: '2023-03-10',
  },
  // Add more blog post objects as needed
];

// Configure middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize session middleware
app.use(
  session({
    secret: 'bigsecrets',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport.js Configuration
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((user) => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: 'Invalid username or password' });
    }

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((user) => user.id === id);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (users.some((user) => user.username === username)) {
    return res.render('register', { error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: users.length + 1,
    username: username,
    password: hashedPassword,
  };

  users.push(newUser);

  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Welcome to the dashboard, ${req.user.username}!`);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Blog Routes
app.get('/blog', (req, res) => {
  // Retrieve and render blog posts
  res.render('blog', { blogPosts });
});

// Additional blog post routes (create, read, update, delete)
// ...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
