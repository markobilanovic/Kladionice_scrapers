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
var url = 'http://www.pinnbet.com/';
var exportFilename = 'csv/pinnbet.csv';

var home = [];
var visitor = [];
var zeroTwo = [];
var threePlus = [];

function save(){
  var csvData = '';
  for(var i = 0; i < home.length; i++){
    csvData += home[i] + "|" + visitor[i] + '|' + zeroTwo[i] + '|' + threePlus[i] + "\n";
    this.echo(home[i] + ' - ' + visitor[i] + ' : ' + zeroTwo[i] + ' | ' + threePlus[i]);
 }

  fs.write(exportFilename, csvData, 'w');
  this.echo('DONE!').exit();
}

function getData() {
	try
	{
		var pageDiv = document.body.querySelectorAll('#ctl00_ContentPlaceHolder1_Panel1 ');
		var tables = pageDiv[0].querySelectorAll('table');
		
		var homeSpans = [];
		var visitorSpans = [];
		var zeroTwoSpans = [];
		var threePlusSpans = [];
		
		var tmpSpan;
		var tmpTwoPlusSpan;

		//iz nekog cudnog razloga sve tabele uzme 2 puta
		for(var i = 1; i < tables.length; i = i + 2 )
		{
			var rows = tables[i].querySelectorAll('tr.bgparovi');
			var rows1 = tables[i].querySelectorAll('tr.bgparovi1');

			for(var j = 0; j < rows.length; j++)
			{
				homeSpans.push(rows[j].querySelector('span#domacin'));
				tmpSpan = rows[j].querySelector('span#gost');
				visitorSpans.push(tmpSpan);
				tmpTwoPlusSpan = tmpSpan.parentNode.nextSibling;
				zeroTwoSpans.push(tmpTwoPlusSpan);
				threePlusSpans.push(tmpTwoPlusSpan.nextSibling);
			}
			
			for(var j = 0; j < rows1.length; j++)
			{
				homeSpans.push(rows1[j].querySelector('span#domacin'));
				tmpSpan = rows[j].querySelector('span#gost');
				visitorSpans.push(tmpSpan);
				tmpTwoPlusSpan = tmpSpan.parentNode.nextSibling;
				zeroTwoSpans.push(tmpTwoPlusSpan);
				threePlusSpans.push(tmpTwoPlusSpan.nextSibling);
			}
		}
		
		var data = [];
		data.push(Array.prototype.map.call(homeSpans, function(e) { return e.innerText.toUpperCase(); }))
		data.push(Array.prototype.map.call(visitorSpans, function(e) { return e.innerText.toUpperCase(); }))
		data.push(Array.prototype.map.call(zeroTwoSpans, function(e) { return e.innerText.trim().toUpperCase(); }))
		data.push(Array.prototype.map.call(threePlusSpans, function(e) { return e.innerText.trim().toUpperCase(); }))
		
		return data;
	}
	catch(e)
	{
		console.log(e.message);
	}
};


//----------------------CASPER-----------------

casper.start(url, function() {
  // do something
});

casper.on('remote.message', function(msg) {
  this.echo('remote message caught: ' + msg);
});

casper.on('step.error', function(err) {
    this.die("Step has failed: " + err);
});

casper.wait(3000, function() {
  this.echo("Loading page...");
  this.page.switchToChildFrame(0);
  //this.page.switchToParentFrame();
});

casper.then(function() {
  this.echo("Klik na 'FUDBAL'.");
  this.click({
        type: 'xpath',
        path: '//*[@id="ctl00_lbKvote"]/div[1]/div[1]/h3/a'
    });
  this.echo("Waiting after click...");
});

casper.wait(1000, function() {
	this.page.switchToChildFrame(0);
});

casper.then(function() {
  this.echo("Klik na 'Ukupno golova'.");
  this.click({
        type: 'xpath',
        path: '//*[@id="ctl00_ContentPlaceHolder1_Panel1"]//table/tbody/tr[1]/td[3]/a'
    });
	 this.echo("Waiting after click...");
});


casper.wait(1000, function() {
	this.page.switchToChildFrame(0);
});


casper.then(function() {
	this.echo("Klik na 'Prikazi kompletnu ponudu'.");
	this.click({
        type: 'xpath',
        path: '//*[@id="ctl00_ContentPlaceHolder1_Panel1"]/div[2]/a[2]'
    });
	 this.echo("Waiting after click...");
});

casper.wait(1000, function() {
	this.page.switchToChildFrame(0);
});

casper.then(function () {
	var data = this.evaluate(getData);
	home = data[0];
	visitor = data[1];
	zeroTwo = data[2];
	threePlus = data[3];
});

casper.then(function () {
	save.call(casper);
});

casper.then(function(){
	this.exit();
});


casper.run();