var casper = require("casper").create({
  verbose: true,
  logLevel: 'error',     // debug, info, warning, error
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  clientScripts: []
});


var fs = require('fs');
var url = 'https://www.mozzartbet.com/#1-0-1';
var exportFilename = 'csv/mozzart.csv';

var home = [];
var visitor = [];
var zeroTwo = [];
var threePlus = [];

var endPage = 1;
var currentPage;


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
    csvData += home[i] + "|" + visitor[i] + '|' + zeroTwo[i] + '|' + threePlus[i] + "\n";
    this.echo(home[i] + ' - ' + visitor[i] + ' : ' + zeroTwo[i] + ' | ' + threePlus[i]);
  }

  fs.write(exportFilename, csvData, 'w');
  this.echo('DONE!').exit();
};

var processPage = function() {
  casper.wait(2000, function() {
    console.log('Loading page...');
  });
  home = home.concat(this.evaluate(getHome));
  visitor = visitor.concat(this.evaluate(getVisitor));
  zeroTwo = zeroTwo.concat(this.evaluate(getZeroTwo));
  threePlus = threePlus.concat(this.evaluate(getThreePlus));

  currentPage = this.fetchText('button.pageNavigator-buttonSelected');
  this.echo("currentPage = " + currentPage);
  if(currentPage == endPage) {
    this.echo("currentPage == endPage");
    saveAndExit.call(casper);
  }

  this.click('button.pageNavigator-buttonFirst');
  this.waitFor(function() { return true}, processPage, forseTerminate);
};


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
  this.echo("Clicking footbal icon");
  this.click('.element.football');
});

casper.wait(2000, function() {
  this.echo("Waiting after click...");
});

casper.then(function() {
  if (this.exists('.ft-filter.active')) {
    this.echo("Unclicking zavrsene meceve");
    this.click('.ft-filter');
    this.wait(function(){
      this.echo("Waiting after click...");
    });
  } else {
    this.echo('Zavrseni mecevi nisu oznaceni');
  }
});

casper.then(function() {
  if (this.exists('.live-filter.active')) {
    this.echo("Unclicking live meceve");
    this.click('.live-filter');
    this.wait(2000, function(){
      this.echo("Waiting after click...");
    });
  } else {
    this.echo('Live mecevi nisu oznaceni');
  }
});

casper.then(function(){
  currentPage = this.fetchText('button.pageNavigator-buttonSelected');
});

casper.then(function(){
  this.click('button.pageNavigator-buttonEnd');
  this.wait(2000, function(){
    this.echo("Waiting after click End Page...");
  });
});

casper.waitFor(function() { return true}, processPage, forseTerminate);

casper.run();
