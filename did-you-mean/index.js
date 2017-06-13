const speller = require('./lib/speller.js');
const fs = require('fs');


function dumpfile (inputFile) {
	var d;
	try {
		d = fs.readFileSync(inputFile,"utf8");
		}catch(er){
		console.log("Could not find the csvfile: " + inputFile);
	}
		return d;
}


var b = dumpfile("./movies.txt");

speller.train(b);
console.log(speller.Nwords);
//speller.edits("Rembo")
console.log(speller.correct("Rembo"));
