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
		this.table= document.querySelector('TABLE');
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

	getColumnCount () {
		this.columnCount = document.getElementById('sheet-current').querySelector('TR')[0].querySelector('TD').length; 
	}


	sum (ths) {
       	const row = this.table.rows[ths.parentNode.parentNode.rowIndex];
       	let sum=0;
       	for(let i=0;i<this.columnCount; i++){
            sum += parseInt(row.cells[i].childNodes[0].value);
       	}
        row.cells[this.columnCount].innerHTML = sum;
	}	

	// SumValueForFooter() {

	// }

	renderTableFooter() {
		const tr = createTR();
		for(let col =0; col<this.model.numCols; col++){
			const td= createTD();
			tr.appendChild(td);
		}
			removeChildren(this.footerEl);
			this.footerEl.appendChild(tr);
	}

	attachEventHandlers () {
		this.sheetBodyEl.addEventListener('click', this.handleSheetClick.bind(this)); 
		this.formulaBarEl.addEventListener('keyup', this.handleFormulaBarChange.bind(this)); 
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