var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 24561);
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var request = require('request');

var mysql = require('mysql');
var pool = mysql.createPool({
    host :  'mysql.eecs.oregonstate.edu',
    user :  'cs290_dheinc',
    password : '6144',
    database : 'cs290_dheinc'
});


app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

app.get('/',function(req,res, next){
    var  context = {results: "Words"};
    res.render('home', context);
});

app.get('/get',function(req,res, next){
    var context = {};
    console.log(req.query);

    pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if(err){
            next(err);
            return;
        }
        console.log(rows);
       res.send(rows);

    });
});

app.post('/post', function(req,res, next){


    var fromClient = req.body;
    console.log(fromClient);
    pool.query("INSERT INTO workouts SET name=?, reps=?, weight=?, date=?, lbs=?",
        [fromClient.name, fromClient.reps, fromClient.weight, fromClient.date, fromClient.lbs], function(err, result, fields){
        if(err){
            next(err);
            return;
        }
        console.log(result);
        res.send(result);
});

});

app.post('/', function(req,res, next){

});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
