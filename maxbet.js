/*
https://www.maxbet.rs/

Fudbal
Izaberi sve
Igre
Ukupno golova 90' (top tipovi)

scrollToBottom()
while 
	predhodni br div-ova sa utakmicama nije jednak predhodnom tom broju

	
*/

var casper = require("casper").create({
  verbose: true,
  logLevel: 'error',     // debug, info, warning, error
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
});


var fs = require('fs');
var url = 'https://www.maxbet.rs/';
var exportFilename = 'maxbet.csv';

var home = [];
var visitor = [];
var zeroTwo = [];
var threePlus = [];

var divNumber;
var oldDivNumber = 0;


function outputJSON(){
	output.push({
		home: home,
		visitor: visitor
	});
	return JSON.stringify(outputJSON);
}

function getHome() {
  //without jQuery
  var matchesDiv = document.querySelectorAll('div.matches-info-table-holder');
  var home = matchesDiv[matchesDiv.length-1].
      querySelectorAll('div.home-visitor-holder > div.home');
  //var home = document.querySelectorAll('div.navigators-holder div:nth-child(2) div.home-visitor-holder > div.home');
  return Array.prototype.map.call(home, function(e) {
    return e.innerText;
  });

  //with jQuery
  /*var home = $('.home');
  return _.map(home, function(e){
    return e.innerText;
  });
  */
}

function getVisitor() {
  var matchesDiv = document.querySelectorAll('div.matches-info-table-holder');
  var visitor = matchesDiv[matchesDiv.length-1].
      querySelectorAll('div.home-visitor-holder > div.visitor');
  return Array.prototype.map.call(visitor, function(e) {
    return e.innerText;
  });
}

function getZeroTwo() {
  var matchesDiv = document.querySelectorAll('div.matches-table-holder');
  var zeroTwoDiv = matchesDiv[matchesDiv.length-1].querySelectorAll('.one-match-row');
  var el;
  var zeroTwoA = [];

  for(var i = 0; i < zeroTwoDiv.length; i++) {
    el = zeroTwoDiv[i].querySelector('div:nth-child(6)');
    zeroTwoA.push(el.innerText);
  }

  return zeroTwoA;
}

function getThreePlus() {
  var matchesDiv = document.querySelectorAll('div.matches-table-holder');
  var threePlusDiv = matchesDiv[matchesDiv.length-1].querySelectorAll('.one-match-row');
  var el;
  var threePlus = [];

  for(var i = 0; i < threePlusDiv.length; i++) {
    el = threePlusDiv[i].querySelector('div:nth-child(7)');
    threePlus.push(el.innerText);
  }

  return threePlus;
}

function forseTerminate(){
  this.echo('thats all folks. ').exit();
}

function saveAndExit() {
  var csvData = '';
  for(var i = 0; i < home.length; i++){
    csvData += home[i] + ", " + visitor[i] + ', ' + zeroTwo[i] + ', ' + threePlus[i] + "\n";
    this.echo(home[i] + ' - ' + visitor[i] + ' : ' + zeroTwo[i] + ':' + threePlus[i]);
  }

  fs.write(exportFilename, csvData, 'w');
  this.echo('DONE!').exit();
};

function getTableCount() {
	var matchesDiv = document.querySelectorAll('div.league-wrapper.ng-scope');
	return matchesDiv.length;
}


var scrollDown = function() {
	oldDivNumber = divNumber;
	casper.echo('Usao');
	casper.scrollToBottom();
	casper.wait(5000, function() {
		console.log('wait scrollToBottom...');
	});
	
	casper.echo('call getTableCount()');
	divNumber = document.querySelectorAll('div.league-wrapper.ng-scope').length;
	casper.echo("divNumber = " + divNumber);
	
	casper.waitFor(function() { return oldDivNumber != divNumber}, scrollDown, forseTerminate);
};




function wait(){
	this.wait(2000, function(){ this.echo("Waiting after scrolling..."); })	
}

//----------------------CASPER-----------------

casper.start(url, function() {
  // do something
});

casper.on('remote.message', function(msg) {
  this.echo('remote message caught: ' + msg);
});

casper.wait(2000, function() {
  this.echo("Loading page...");
});

casper.then(function() {
  this.echo("Klik na 'Fudbal' filter.");
  this.click('div.sport-default.sport-S.sports-txt');
});

casper.wait(3000, function() {
	this.echo("Wait after click...");
});

casper.waitForSelector("div.select-all-leagues.select-all-leagues-S", function() {
	this.capture('Fudbal_clicked.png');
	this.echo("Klik na 'Izaberi sve' filter.");
	this.click('div.select-all-leagues.select-all-leagues-S');
});

//mozda treba zato sto koliko vidim opcija filtera je dostupna i bez tog dugmeta
/*casper.waitForSelector("button.tip-type-group-button", function() {
	this.echo("Klik na 'Igre' opciju.");
	this.click('div.tip-type-group-button');
});*/
casper.wait(5000, function() {
	this.echo("Wait after click...");
});


//izgleda sam bio prepusen i nisam video da je 0-2 i 3+ odmah vidljivo
/*
casper.waitForSelector("div.tip-type-inner.border-radius.ng-binding", function() {
	this.capture('Izaberi_sve_clicked.png');
	this.echo("Klik na 'Ukupno golova 90' (top tipovi)' opciju.");
	this.click('div.tip-type-inner.border-radius.ng-binding');
});

casper.wait(5000, function() {
	this.capture('Ukupno_golova_clicked.png');
  this.echo("Wait after click...");
});
*/


casper.then(function() {
	divNumber = this.evaluate(getTableCount);
	this.echo("divNumber = " + divNumber);
	this.echo("old = " + oldDivNumber);
});

casper.wait(10000, function () {
    this.page.scrollPosition = { top: this.page.scrollPosition["top"] + document.body.scrollHeight, left: 0 };
})
/*
casper.then(function() {
	casper.scrollToBottom();
});
*/
casper.then(function() {
	this.capture('scrolled.png');
	this.echo("captured scroll");
});

//casper.waitFor(function() { return oldDivNumber != divNumber }, scrollDown, forseTerminate);

/*
casper.then(function() {
	var divNumber = this.evaluate(getTableCount);
	this.echo('divNumber = ' + divNumber);
	var oldDivNumber = 0;
	while(oldDivNumber != divNumber) {
		oldDivNumber = divNumber;
		this.scrollToBottom();
		wait.call(casper);
		divNumber = this.evaluate(getTableCount);
		this.echo('divNumber = ' + divNumber);
		this.echo('oldDivNumber = ' + oldDivNumber);
	}
});*/

casper.then(function(){
	var x = this.fetchText('div.home-game.bck-col-1');
	// this.echo(x);
	this.exit();
});


casper.run();
