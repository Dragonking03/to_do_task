const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const session = require('express-session');

const app = express();

app.set('view engine', 'ejs');

app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } 
  }));

const aboutContent = "Welcome to To_Do_Task, where productivity meets simplicity. We're dedicated to making task management effortless, so you can focus on what matters most. Our intuitive platform offers customizable workflows, seamless collaboration, and cross-platform accessibility. Whether you're a student, professional, or entrepreneur, To_Do_Task adapts to your unique needs. Join us on a journey to unlock your full potential through efficient task management. Make every day count – sign up now and experience productivity redefined with To_Do_Task.";

const contactContent = "Have a question or feedback? We're here to help! Contact the To_Do_Task team for prompt assistance. Whether it's a technical query, feature suggestion, or just a friendly hello, we value your input. Reach out through the form below or drop us an email at [your@email.com]. Follow us on social media for updates. Your satisfaction is our priority, and we look forward to enhancing your experience with To_Do_Task. Thank you for choosing us as your productivity partner – we're here to support you every step of the way!"

let task = [];
const users = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index.ejs", {task: task})
})

app.get("/about", (req, res) => {
    res.render("about.ejs", {about: aboutContent});
  })
 
app.get("/contact", (req, res) => {
    res.render("contact.ejs", {contact: contactContent});
  })
  
app.get("/compose", (req, res) => {
    res.render("compose.ejs");
  })

app.post("/compose", (req, res) => {
    const post = {
        title: req.body["taskTitle"],
        content: req.body["post"]
    };

    task.push(post);
    res.redirect("/")
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
  
    if (user) {
      
      if (user.password === password) {
        
        req.session.user = { id: user.id, username: user.username };
        
        res.redirect("/");
      } else {
        
        res.send("Invalid password");
      }
    } else {
      
      const newUser = { id: users.length + 1, username, password };
      users.push(newUser);
  
      
      req.session.user = { id: newUser.id, username: newUser.username };
      res.redirect("/");
    }
  });
  
app.get("/signin", (req,res) => {
    res.render("signin.ejs");
})

app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(u => u.username === username);
  
    if (existingUser) {
      res.send('Username already taken. Please choose a different username.');
    } else {
      const newUser = { id: users.length + 1, username, password };
      users.push(newUser);

      req.session.user = { id: newUser.id, username: newUser.username };
        
      res.redirect("/");
    }
  });

app.get('/logout', (req, res) => {
    
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      
      res.redirect('/login');
    });
  });
  

app.get("/task/:taskName", (req, res) => {
    const requiredTitle = _.lowerCase(req.params.taskName) ;
    task.forEach(function(post){
      const storedTitle = _.lowerCase(post.title);
      if(storedTitle ===  requiredTitle ){
        
        res.render("post.ejs", {
          title: _.startCase(storedTitle),
          content: post.content
        });
    }
    }
  )
  })

app.get('/get-started', (req, res) => {
    res.redirect("/compose ");
   });

app.listen(3000, function() {
    console.log("Server started on port 3000");
  });