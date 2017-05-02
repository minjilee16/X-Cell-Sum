(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table_model');
const TableView = require('./table_view');


const model = new TableModel(); 
const tableView = new TableView(model); 
tableView.init(); 


},{"./table_model":4,"./table_view":5}],2:[function(require,module,exports){
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



module.exports={
	getRange : getRange,
	letterGetRange : letterGetRange, 
};
},{}],3:[function(require,module,exports){
const removeChildren = function (parentEl) {
	while(parentEl.firstChild) {
		parentEl.removeChild(parentEl.firstChild); 
	}
}

const createEl= function (tagName) {
	return function(text) {
		const el = document.createElement(tagName);
		if(text) {
			el.textContent=text; 
		}
		return el; 
	};
};


const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');


module.exports = {
	removeChildren : removeChildren,
	createTR : createTR,
	createTH : createTH,
	createTD : createTD
};
},{}],4:[function(require,module,exports){
class TableModel {
	constructor (numCols=10, numRows=20) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId (location) {
		return `${location.col}:${location.row}`;
	}

	getValue (location) {
		return this.data[this._getCellId(location)]; 
	}

	setValue (location, value) {
		return this.data[this._getCellId(location)] = value; 
	}
}



module.exports=TableModel;
},{}],5:[function(require,module,exports){
const { letterGetRange, getRange } = require ('./array_until');
const { removeChildren, createTH, createTR, createTD } = require('./dom_until'); 



class TableView {
	
	constructor (model) {
		this.model = model; 
	}


	init() {
		this.initDomReferences();
		this.initCurrentCell(); 
		this.renderTable();
		this.attachEventHandlers();
	}


	initDomReferences() {
		this.headerRowEl = document.querySelector('THEAD TR'); 
		this.sheetBodyEl = document.querySelector('TBODY'); 
		this.footerEl = document.querySelector('TFOOT'); 
		this.formulaBarEl=document.querySelector('#formula-bar'); 
		this.addRowEl = document.querySelector('#addRow');
		this.addColEl = document.querySelector('#addColumn');
	}


	initCurrentCell() {
		this.currentCellLocation = { col: 0, row: 0};
		this.renderFormulaBar(); 
	}


	normalizeValueForRendering(value) {
		return value || '';
	}


	renderFormulaBar () {
		const currentCellValue = this.model.getValue(this.currentCellLocation);
		this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue); 
		this.formulaBarEl.focus();
	}


	renderTable() {
		this.renderTableHeader();
		this.renderTableFooter();
		this.renderTableBody();
		this.sum();
		this.addRow(); 
	}


	renderTableHeader() {
		removeChildren(this.headerRowEl);
		letterGetRange('A', this.model.numCols)
		.map(colLabel => createTH(colLabel))
		.forEach(th => this.headerRowEl.appendChild(th)); 
	}


	isCurrentCell(col, row) {
		return this.currentCellLocation.col === col &&
		       this.currentCellLocation.row === row; 
	}


	addRow() {
		this.model.numRows++;
		this.renderTableBody()
	}


	addColmn ( ) {
		this.model.numCols++;
		this.renderTableHeader();
		this.renderTableBody();
		this.sum();
		this.renderTableFooter();
	}


	renderTableBody() {
		const fragment = document.createDocumentFragment();
		for(let row =0; row < this.model.numRows; row++) {
			const tr = createTR(); 
			for(let col =0; col<this.model.numCols; col++) {
				const position = {col:col, row:row}; 
				const value = this.model.getValue(position);
				const td = createTD(value); 

				if(this.isCurrentCell(col, row)) {
					td.className = 'current-cell'; 
				}
				tr.appendChild(td); 
			}
			fragment.appendChild(tr); 
		}
		removeChildren(this.sheetBodyEl); 
		this.sheetBodyEl.appendChild(fragment); 
	}


	sum () {
  		let nums= Array.apply(null, Array(this.model.numCols)).map(function() { return null });
		for(let row =0; row < this.model.numRows; row++) {
			for(let col =0; col<this.model.numCols; col++) {
				const position = {col:col, row:row}; 
				const value = this.model.getValue(position);
	
				const onlyNum = parseInt(value); 
				 if( !isNaN(onlyNum) ) {
					nums[col] += onlyNum;
				} 
  			}
  		} 
  	return nums; 
	}


	renderTableFooter() {
		const tr = createTR();
		for(let col =0; col<this.model.numCols; col++){
			const td= createTD();
			tr.appendChild(td);
		}
		removeChildren(this.footerEl);
		this.footerEl.appendChild(tr);

		let footCol = this.footerEl.querySelectorAll('TD');
		let numsSum = this.sum();
		for (let i=0; i < this.model.numCols; i++) {
			footCol[i].textContent = numsSum[i];
		}
	}


	attachEventHandlers () {
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this)); 
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this)); 
		this.formulaBarEl.addEventListener('keyup', this.renderTableFooter.bind(this)); 
		this.addRowEl.addEventListener('click', this.addRow.bind(this)); 
		this.addColEl.addEventListener('click', this.addColmn.bind(this)); 
	}


	handleFormulaBarChange(evt) {
		const value = this.formulaBarEl.value; 
		this.model.setValue(this.currentCellLocation, value);
		this.renderTableBody();
	}


	handleSheetClick(evt) {
		const col = evt.target.cellIndex; 
		const row = evt.target.parentElement.rowIndex -1; 
		this.currentCellLocation = {col: col, row: row}; 
		this.renderTableBody(); 
		this.renderFormulaBar(); 
	}
}



module.exports=TableView; 
},{"./array_until":2,"./dom_until":3}]},{},[1]);
