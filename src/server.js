const express = require('express');
const bodyParser = require("body-parser");
const session = require('express-session');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
}));

// Middleware to add user info to res.locals
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.redirect('/login');
  }
}

//middleware and static files
app.use(express.static('public'));


app.get('/', async (req, res) => {
  const blogs = await Blog.find({}); // Fetch all blogs
  res.render('home.ejs', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

app.get('/services', ensureAuthenticated, (req, res) => {
  const services = [{
    _id: "1",
    image: "/images/Listing 1.png",
    title: "$1,200,000",
    description: "A Giant Plot of land right in the heart of Ottawa."
  },
  {
    _id: "2",
    image: "/images/Listing 2.png",
    title: "$750,000",
    description: "A Family House in Texas."
  },
  {
    _id: "3",
    image: "/images/Listing 3.png",
    title: "$185,000",
    description: "Single Home with, an affordable option!"
  },
  {
    _id: "4",
    image: "/images/Listing 4.png",
    title: "$50,000",
    description: "An affordable plot of land."
  }
    // Add more service objects here
  ];
  res.render('services', { title: 'About Us', services: services });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/login', (req, res) => {
  res.render('login', { title: 'LogIn' });
});

app.get('/sign-up', (req, res) => {
  res.render('signup', { title: 'Sign-Up' });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (user && user.password === password) { // Simple password check, consider using bcrypt in production
    req.session.user = user; // Save user in session
    res.redirect('/'); // Redirect to home
  } else {
    res.redirect('/login'); // Redirect back to login
  }
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password
  }
  await User.create(data); // Create a new user
  res.redirect('/login'); // Redirect to login
});

app.get('/signout', (req, res) => {
  req.session.destroy(); // Destroy the session
  res.redirect('/'); // Redirect to home
});

app.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author'); // Fetch blog by id
  res.render('blog', { title: 'Blog', blog });
});

app.get('/my-blogs', ensureAuthenticated, async (req, res) => {
  const blogs = await Blog.find({ author: req.session.user._id }); // Fetch blogs by logged in user
  res.render('my-blogs', { title: 'My Blogs', blogs });
});

app.get('/create-blog', ensureAuthenticated, (req, res) => {
  res.render('create-blog', { title: 'Create Blog' });
});


app.post('/create-blog', ensureAuthenticated, async (req, res) => {
  const selectedService = req.body.service;
  console.log(selectedService.content)
  const data = {
    title: selectedService.title,
    id: selectedService._id,
    content: selectedService.description,
    image: selectedService.image,
    author: req.session.user._id
  }
  await Blog.create(data); // Create a new blog
  res.redirect('/my-blogs'); // Redirect to my blogs
});

app.get('/blogs/:id/delete', ensureAuthenticated, async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id); // Delete blog by id
  res.redirect('/my-blogs'); // Redirect to my blogs
});

const { User, Blog, connectDB } = require("./mongoDB");

// Connect to the database
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
