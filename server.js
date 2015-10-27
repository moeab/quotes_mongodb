var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quotes_revisited');

var quoteSchema = new mongoose.Schema({
	name : String,
	quote : String,
	created_at : Date
})
var Quote = mongoose.model('quote', quoteSchema);

// var date = new Date();
// var time = new Date().toLocaleTimeString();
// console.log(date);

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render('index');
})


app.post('/quotes', function(req, res){
	var add_quote = new Quote({name: req.body.name, quote : req.body.quote, created_at : new Date()});
	add_quote.save(function(err){
		if (err){
			console.log('Entry error');
			res.redirect('/');
		} else {
			console.log('Quote added');
			res.redirect('/quotes');
		}
	})
})

app.get('/quotes', function(req, res){
	var quote_list = [];
	Quote.find({}, function(err, quotes){
		if(err){
			console.log('Load error');
			res.redirect('/');
		} else {
			for (var i = 0; i < quotes.length; i++) {
				quote_list.push({name : quotes[i].name, quote : quotes[i].quote, date : quotes[i].created_at.toLocaleString() });
			}
			res.render('quotes', { quotes : quote_list});
		}
	})
})

app.listen(3456, function(){
	console.log('listening on port 3456');
})