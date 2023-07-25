const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:false}));

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

app.get('/services', (req, res) => {
  res.render('services', { title: 'About Us' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/login',(req,res)=>{
  res.render('login',{title: 'LogIn'});
});

app.get('/sign-up',(req,res)=>{
  res.render('signup',{title: 'Sign-Up'});
});

app.post("/login",async (req,res)=>{
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (user && user.password === password) { // Simple password check, consider using bcrypt in production
    req.session.user = user; // Save user in session
    res.redirect('/'); // Redirect to home
  } else {
    res.redirect('/login'); // Redirect back to login
  }
});

app.post("/signup",async (req,res)=>{
  const data={
    name:req.body.name,
    password:req.body.password
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
  const data = {
    title: req.body.title,
    content: req.body.content,
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