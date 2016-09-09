'use strict';
const fs = require('fs');
const readline = require ('readline');
const rs = fs.ReadStream('./popu-pref.csv');
const r1 = readline.createInterface({ 'input': rs, 'output': {} });
const map = new Map();
r1.on('line',(lineString) => {
	const colums = lineString.split(',');
	const year = parseInt(colums[0]);
	const prefecture = colums[2];
	const popu = parseInt(colums[7]);
	if (year === 2010 || year === 2015) {
		let value = map.get(prefecture);
		if (!value) {
			value = {
				p10: 0,
				p15: 0,
				change: null
			};
		}
		if (year === 2010){
			value.p10 += popu;
		}
		if (year === 2015){
			value.p15 += popu;
		}
		map.set(prefecture, value);
	}
});
r1.resume();

r1.on('close', () => {
	for (let pair of map){
		const value = pair[1];
		value.change = value.p15 /value.p10;
	}
	const rankingArray = Array.from(map).sort((p1,p2) => {
		return p2[1].change - p1[1].change;
	});
	const rankingStrings = rankingArray.map((p) => {
		return p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + '変化率:' + p[1].change;
	});
	console.log(rankingStrings);
});