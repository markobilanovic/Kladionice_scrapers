var casper = require("casper").create({
  verbose: true,
  logLevel: 'debug',     // debug, info, warning, error
  pageSettings: {
    loadImages: false,
    loadPlugins: false,
	//userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1588.0 Safari/537.36'
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
  },
  clientScripts: ["vendor/main.js"]
  /* clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js", "vendor/jquery-migrate-1.4.1.js", 
					"vendor/analytics.js", "vendor/iframeResizer.js",
					"vendor/main.js", "vendor/require.js",
					"vendor/vendor.js", "vendor/recaptcha.js"]
					
	  clientScripts: [	"vendor/jquery-3.1.0.min.js", 
					"vendor/vendor.js", 
					"vendor/jquery-migrate-1.4.1.min.js", 
					"vendor/jquery.signalR-2.2.1.min.js",
					"vendor/main.js",
					"vendor/require.js"
				]
	*/
	//clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
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
    vals = homeDivs[i].innerText.split(' - ');
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
    vals = visitorDivs[i].innerText.split(' - ');
    visitorA.push(vals[vals.length - 1].trim().toUpperCase());
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
 /* this.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
  });

  this.on('page.error', function(msg, backtrace) {
    this.echo("Error: " + msg, "ERROR");
  });*/
});

casper.on("remote.message", function(msg) {
    this.echo("Console: " + msg);
});

// http://docs.casperjs.org/en/latest/events-filters.html#page-error
casper.on("page.error", function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
    });
  }

  console.error(msgStack.join('\n'));
    // maybe make it a little fancier with the code from the PhantomJS equivalent
});

// http://docs.casperjs.org/en/latest/events-filters.html#resource-error
casper.on("resource.error", function(resourceError) {
    this.echo("ResourceError: " + JSON.stringify(resourceError, undefined, 4));
});


/*
casper.on('resource.received', function(resource) {
    casper.echo(resource.url);
	
	if(resource.url == "https://www.maxbet.rs/ibet/main.js?v=2.95.1" ||
		resource.url == "https://www.maxbet.rs/bet/main.js?v=2.95.1")
	{
		
	}
	
});*/

casper.on('page.resource.requested', function(requestData, networkRequest) {
    casper.echo("URL: " + requestData.url);
	casper.echo("Headers: " + requestData.headers);
	casper.echo("PostData: " + requestData.postData);
	if (requestData.url.indexOf('https://www.maxbet.rs/ibet/main.js?v=2.95.1') === 0 ||
		requestData.url.indexOf('https://www.maxbet.rs/bet/main.js?v=2.95.1') === 0)
	{
		casper.echo("TEST: " + requestData);
        networkRequest.changeUrl("vendor/main.js");
    }
});

/*
casper.then(function () {
	this.page.injectJs('vendor/jquery.signalR-2.2.1.min.js');
});
*/

casper.wait(30000, function() {
  this.echo("Loading page...");
  this.capture('test.png');
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

// http://docs.casperjs.org/en/latest/events-filters.html#page-initialized
/*
casper.on("page.initialized", function(page) {
    // CasperJS doesn't provide `onResourceTimeout`, so it must be set through 
    // the PhantomJS means. This is only possible when the page is initialized
    page.onResourceTimeout = function(request) {
        console.log('Response Timeout (#' + request.id + '): ' + JSON.stringify(request));
    };
});*/


casper.run();


