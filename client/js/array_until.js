const getRange = function (fromNum, toNum) {
	return Array.from( {length: toNum-fromNum+1}, 
		(unused, i) => i +fromNum);
}

const letterGetRange = function (firstLetter="A", numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters  -1; 
	return getRange(rangeStart, rangeEnd)
	.map(charCode => String.fromCharCode(charCode) );

}


// const sum = function (allNum) {
// 	return allNum.reduce((a,b) => a+b); 
// }


module.exports={
	getRange : getRange,
	letterGetRange : letterGetRange, 
	// sum : sum 
};