//import the require dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./config/dbconnect.js');
const con =db.connection;


// enable ejs 
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_Lab1_Anudeep_Chitta',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 30 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));


app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  

//Route to handle Post Request Call
app.post('/customerlogin',function(req,res){
     var username = req.body.username;
     var password = req.body.password;
     var match = false;
    console.log("Inside Login Post Request");
    console.log("Req Body : ", username + "password : ",password);
    var dbpassword = con.query('SELECT password FROM customerlogin WHERE username = ?',username, (err,rows) => {
        if(err) throw err;
      
        console.log('Data received from Db:');
        console.log(rows);
      });
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            match = true;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful login")
           }
    if(match == false){
        res.writeHead(401,{
            'Content-Type' : 'text/plain'
        })
        res.end("Incorrect Login Creds");
    }
    
});

//Route to get All Books when user visits the Home Page
app.get('/home', function(req,res){
    console.log("Inside Home Login");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));
    
})

app.post('/create',function(req,res){
    console.log("Inside create req:",JSON.stringify(req.body));

    var newBook = { "BookID": req.body.BookID, 
    "Title": req.body.Title, 
    "Author": req.body.Author };
    var match = false; 
    for(let i=0;i<books.length;i++){ 
        var book =books[i];
        console.log("book:",book);
        if (book.BookID===newBook.BookID ){ 
        match =true; 
        console.log("match triggered");
        break;}
    };
        
    if (match) {
        res.writeHead(401,{
            'Content-Type' : 'application/json'
        });
        res.end('ID  of a Book must be unique');
    }
    else{
        books.push(newBook);
        console.log("books : ", books);
        res.writeHead(200,{
            'Content-Type' : 'application/json'
        });
        res.end('book added');
    }


})

app.post('/delete',function(req,res){
    console.log("Inside  Delete");
    console.log("Req Body : ",JSON.stringify(req.body));
        var deleteID= req.body.BookID;
        let match = false;
        for(let i=0;i<books.length;i++){ 
            var bookID =books[i].BookID;
            if (bookID===deleteID ){ 
            match =true; 
            console.log("delete match triggered");
            books.splice(i,1);
            break;
            }//if
        }
        
        if(!match){
            res.writeHead(401,{
                'Content-Type' : 'application/json'
            });
            res.end('Book with this  ID does not exist ');
        }
        else{
            
            console.log("books after delete : ", books);
            res.writeHead(200,{
                'Content-Type' : 'application/json'
            });
            res.end('book deleted');
        }
    
})



//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");