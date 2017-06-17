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

var currentLeague = 3;//preskacu se prva 2
var leaguesCount = 0;


function getNextLeagueDivSelector() {
  return "//*[@id=\"topView\"]/div[1]/div[2]/div[3]/div/div[1]/div[2]/div[" + currentLeague + "]/p";
}

function getLeaguesCount() {
  var fudbalDiv = document.querySelectorAll('div.league-wrapper.sport-S-wrapper.ng-scope');//length = 8
  fudbalDiv = fudbalDiv[0];
  var leagueDivs = fudbalDiv.querySelectorAll('p[ui-sref="home.leaguesWithMatches"]');
  return leagueDivs.length;
}

function getHome() {
  var tableElement = document.querySelectorAll('.cc-top-matches.box-shadow.pos-full-width');
  var homeDivs = tableElement[0].querySelectorAll('div.teams-overflow.ng-binding');
  var homeA = [];
  var vals;
  for(var i = 0; i < homeDivs.length; i++) {
    vals = homeDivs[i].innerText.split('-');
    homeA.push(vals[0].trim().toUpperCase());
  }
  return homeA;
}

function getVisitor() {
  var tableElement = document.querySelectorAll('.cc-top-matches.box-shadow.pos-full-width');
  var visitorDivs = tableElement[0].querySelectorAll('div.teams-overflow.ng-binding');
  var visitorA = [];
  var vals;
  for(var i = 0; i < visitorDivs.length; i++) {
    vals = visitorDivs[i].innerText.split('-');
    visitorA.push(vals[1].trim().toUpperCase());
  }
  return visitorA;
}

function getZeroTwo() {
  var tableElement = document.querySelectorAll('.cc-top-matches.box-shadow.pos-full-width');
  var zeroTwoDivs = tableElement[0].querySelectorAll('odd[title="0-2 gola na utakmici"]');
  var zeroTwoA = [];

  for(var i = 0; i < zeroTwoDivs.length; i++) {
    zeroTwoA.push(zeroTwoDivs[i].innerText);
  }
  return zeroTwoA;
}

function getThreePlus() {
  var tableElement = document.querySelectorAll('.cc-top-matches.box-shadow.pos-full-width');
  var threePlusDivs = tableElement[0].querySelectorAll('odd[title="3 ili više golova na utakmici"]');
  var threePlusA = [];

  for(var i = 0; i < threePlusDivs.length; i++) {
    threePlusA.push(threePlusDivs[i].innerText);
  }
  return threePlusA;
}

function forseTerminate(){
  this.echo('thats all folks. ').exit();
}

function saveAndExit() {
  var csvData = '';
  for(var i = 0; i < home.length; i++){
    csvData += home[i] + "|" + visitor[i] + '|' + zeroTwo[i] + '|' + threePlus[i] + "\n";
    this.echo(home[i] + ' - ' + visitor[i] + ' : ' + zeroTwo[i] + ' | ' + threePlus[i]);
  }

  fs.write(exportFilename, csvData, 'w');
  this.echo('DONE!').exit();
};


var processPage = function() {
  this.wait(1500, function() {
    console.log('Loading table...');
  });

  home = home.concat(this.evaluate(getHome));
  visitor = visitor.concat(this.evaluate(getVisitor));
  zeroTwo = zeroTwo.concat(this.evaluate(getZeroTwo));
  threePlus = threePlus.concat(this.evaluate(getThreePlus));

  if(currentLeague == leaguesCount) {
    this.echo("currentLeague == leaguesCount");
    saveAndExit.call(casper);
  }

  currentLeague++;
  this.echo("currentLeague = " + currentLeague);
  var selector = getNextLeagueDivSelector();
  this.click({ type: 'xpath', path : selector });
  casper.waitFor(function() { return true}, processPage, forseTerminate);
};


//----------------------CASPER-----------------

casper.start(url, function() {
  this.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
  });

  this.on('page.error', function(msg, backtrace) {
    this.echo("Error: " + msg, "ERROR");
  });
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
  leaguesCount = this.evaluate(getLeaguesCount);
  this.echo("leaguesCount = " + leaguesCount);

  var selector = getNextLeagueDivSelector();
  this.click({ type: 'xpath', path : selector });
});

casper.wait(2000, function() {
  this.echo("Loading first table...");
});

casper.waitFor(function() { return true}, processPage, forseTerminate);

casper.then(function(){
	this.exit();
});

casper.run();
