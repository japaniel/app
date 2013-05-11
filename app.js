var express = require('express'),
    app = express(),
		request = require('request'),
		mysql = require('mysql'),
		db = mysql.createConnection({
			host: 'localhost',
			user: 'node',
			password: '2stepLikeAMadMan',
			database: 'app'
		});
		
app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

// Sample Routes
app.get('/', function(req, res) {
  res.send('Roots!');
});

app.get('/another/route', function(req, res) {
  res.json({hurp: 'some json stuffs', durp: 'some more properties'});
});


app.get('/getThumbnails', function(req, res) {
	request('http://thumbnails.i.tv/thumbnails/program/sm-4d8dca164ee0cfc3279d79191356237b.2012-12-05', function (err, resp, body) {

		//TODO sanitize
		var insertData = function (obj) {
			db.query('INSERT INTO data ( offset, programId, url, _id ) VALUES (?, ?, ?, ?);', [obj.offset, obj.programId, obj.url, obj._id], function (err, rows) {
				if (!err) {
					console.log('looks like we did it!    ');
				} else {
					console.log('bitter beer face   !!!! ' + err);
				}
			});
		};

		results = JSON.parse(body);
	
		for (elm in results) {
			//console.log(results[elm]);
			insertData(results[elm]);
		}
	});
	
	res.send('We got the data');
});


app.get('/thumbnailsBetween/start/:someStartTime/end/:someEndTime', function(req, res) {
	var start = req.params.someStartTime;
	var finish = req.params.someEndTime;

	var getData = function (start, finish) {
		db.query('SELECT * FROM data WHERE offset >= ? AND offset <= ?', [start, finish], function (err, rows) {
			if (err) throw err;
			
			res.send(rows);
		});
	};
	
	if (start && finish) {
		getData(start, finish);
	}
});


// start up the server on port 3000
app.listen(3001)
