const { getLetterRange } = require ('./array_until');
const { removeChildren, createTH, createTR, createTD } = require('./dom_until'); 



class TableView {
	constructor (model) {
		this.model = model; 
	}

	init() {
		this.initDomReferences();
		this.renderTable();
	}

	initDomReferences() {
		this.headerRowEl = document.querySelector('THEAD TR'); 
	}

	renderTable() {
		this.renderTableHeader();
	}

	renderTableHeader() {
		removeChildren(this.headerRowEl);
		getLetterRange('A', this.model.numCols)
		.map(colLabel => createTH(colLabel))
		.forEach(th => this.headerRowEl.appendChild(th)); 
	}




}



module.exports=TableView; 