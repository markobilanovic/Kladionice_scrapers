/*
https://www.maxbet.rs/

Fudbal
Izaberi sve
Igre
Ukupno golova 90' (top tipovi)

scrollToBottom()
while 
	predhodni br div-ova sa utakmicama nije jednak predhodnom tom broju

	
	
	COMMENT: pokusao sam sa scroll down da ucitam sve pa da scrapeujem.
	Posto tako nece da ucita celu stranicu kliktacu redom na div-ove unutar fudbal dropdown liste i nakon svakog klika scrape-ujem top div
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
var exportFilename = 'csv/maxbet.csv';

var home = [];
var visitor = [];
var zeroTwo = [];
var threePlus = [];

var currentLeague = 3;
var leaguesCount = 0;


function getNextLeagueDivSelector() {
  var divSelector = "//*[@id=\"topView\"]/div[1]/div[2]/div[3]/div/div[1]/div[2]/div[" + currentLeague + "]/p";
  return divSelector;
}

function getLeaguesCount() {
  var fudbalDiv = document.querySelectorAll('div.league-wrapper.sport-S-wrapper.ng-scope');//length = 8
  fudbalDiv = fudbalDiv[0];
  var leagueDivs = fudbalDiv.querySelectorAll('p[ui-sref="home.leaguesWithMatches"]');
  return leagueDivs.length;
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

casper.wait(5000, function() {
	this.echo("Wait after click...");
});

casper.then(function () {
  leaguesCount = this.evaluate(getLeaguesCount) - 1;
  this.echo("leaguesCount = " + leaguesCount);
});

casper.then(function () {

  for(var i = 0; i < leaguesCount; i++)
  {
    var selector = getNextLeagueDivSelector();
    this.echo('selector = ' + selector);
    this.click({ type: 'xpath', path : selector });
    this.evaluate();
    currentLeague++;
  }

  /*var selector = this.evaluate(getNextLeagueDivSelector);
  this.echo('selector = ' + selector);
  this.click({
    type: 'xpath',
    path : selector
  });*/
});


casper.wait(2000, function() {
  this.echo("Wait after click...");
});

casper.then(function() {
  //this.capture('test.png');
});



/*
casper.waitForSelector("div.select-all-leagues.select-all-leagues-S", function() {
	this.capture('img/Fudbal_clicked.png');
	this.echo("Klik na 'Izaberi sve' filter.");
	this.click('div.select-all-leagues.select-all-leagues-S');
});
*/
//mozda treba zato sto koliko vidim opcija filtera je dostupna i bez tog dugmeta
/*casper.waitForSelector("button.tip-type-group-button", function() {
	this.echo("Klik na 'Igre' opciju.");
	this.click('div.tip-type-group-button');
});
casper.wait(5000, function() {
	this.echo("Wait after click...");
});*/


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

/*
casper.then(function() {
	casper.scrollToBottom();
});
*/

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
