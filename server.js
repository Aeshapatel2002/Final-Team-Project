const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));
app.set('view engine', 'ejs');

//middleware and static files 
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.render('home.ejs',{ title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about.ejs', { title: 'About Us' });
});

app.get('/project', (req, res) => {
  res.render('project', { title: 'Project' });
});

app.get('/services', (req, res) => {
  res.render('services', { title: 'Services' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/login',(req,res)=>{
  res.render('login',{title: 'LogIn'});
});

app.get('/sign-up',(req,res)=>{
  app.render('signup',{title: 'Sign-Up'});
});

app.post("/login",async (req,res)=>{

})

app.post("/signup",async (req,res)=>{
  
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
