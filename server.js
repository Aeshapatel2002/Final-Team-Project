const express = require('express');
const app = express;
const path = require('path');

//middleware and static files 
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(express.static(path.join(__dirname,'../node_modules')));

//View Engine Set-Up
app.set('views',path.join(__dirname,'./views'));
app.set('vieew engine','ejs');


app.get('/',(req,res)=>{
    res.render('home.ejs', {title: 'Home'});
});

app.get('/about',(req,res)=>{
    res.render('about.ejs', {title: 'About Us'});
});

app.get('/services',(req,res)=>{
    res.render('services.ejs', {title: 'Services'});
});

app.get('/contact',(req,res)=>{
    res.render('contact.ejs', {title: 'Contact'});
});


//listening to port  
app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})  