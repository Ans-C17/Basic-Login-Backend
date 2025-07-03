const fs = require('fs');
const userPath = './users.json';
const express = require('express'); //import pole
const path = require('path');
const app = express(); //app is now my server, ill use app to tell server what to do
const port = 3000;
app.use(express.urlencoded({extended: true})); //converts the urlencoded thing into an object in js

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/login', (req, res) => {
    const username = req.body.username.trim(); //the name attribute helps to take this username and password as i mentiond it in html
    const password = req.body.password.trim(); //browser requests us to take this post he sent, the post is in urlencoded form as req. we converted that req into an object
    
    let users = [];
    if(fs.existsSync(userPath)){
        const data = fs.readFileSync(userPath, 'utf-8');
        users = JSON.parse(data);
    }

    //now check if that user is already there
    const userFound = users.find((user) => {
        return (user.username === username && user.password === password)
    })
    
    if(userFound) res.redirect('/dashboard');
    else res.redirect('/?invalidLogin=1'); //this called index.html (because  any '/' goes to index.html) andunder that, the script does the work
})

app.post('/signup', (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    const confirmPassword = req.body.confirmPassword;
    if(password !== confirmPassword) return res.redirect('/signup?invalidPassword=1');

    let users = [];
    if(fs.existsSync(userPath)){
        const data = fs.readFileSync(userPath, 'utf-8');
        users = JSON.parse(data);
    }

    //now check if that user is already there
    const userFound = users.find((user) => {
        return user.username === username
    })
    if(userFound) return res.redirect('/');

    //if not, add new user
    users.push({username, password}) //this is a shorthand, when the username variable and password vars have the same name as the keys in the object
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
    res.redirect('/');
})

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
})

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})