const fs= require('fs'); 
const TableModel =require('../table_model'); 
const TableView =require('../table_view'); 

describe('table_view', () => {
  beforeEach( () => {
    const fixturePath = './client/js/test/fixtures/sheet-container.html'; 
    const html= fs.readFileSync(fixturePath, 'utf8');
    document.documentElement.innerHTML = html; 
  });

  describe('formula bar', () => {
    it('makes changes TO the value of the current cell', () => {
      // set up the initial state
      const model = new TableModel(3,3);
      const view = new TableView(model); 
      view.init(); 
    
      // inspect the initial state
      let trs= document.querySelectorAll('TBODY TR'); 
      let td= trs[0].cells[0];
      expect(td.textContent).toBe('');
      // simulate user action 
      document.querySelector('#formula-bar').value = '65';
      view.handleFormulaBarChange();
      // inspect the resulitng state 
      trs= document.querySelectorAll('TBODY TR'); 
      expect(trs[0].cells[0].textContent).toBe('65'); 
    }); 


    it('updates FROM the value of the current cell', () => {
      const model = new TableModel(3,3);
      const view = new TableView(model); 
      model.setValue({col:2, row:1}, '123');
      view.init(); 

      const formulaBarEl = document.querySelector('#formula-bar'); 
      expect(formulaBarEl.value).toBe('');

      const trs = document.querySelectorAll('TBODY TR'); 
      trs[1].cells[2].click();

      expect(formulaBarEl.value).toBe('123');
    });
  });

  describe('table body', () => {
    it('has the right size', () => {
      const numCols=6;
      const numRows=10; 
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init(); 

      let ths = document.querySelectorAll('THEAD TH'); 
      expect(ths.length).toBe(numCols);
    })  

    it('fills in values from the model', () => {
      const model = new TableModel(3,3);
      const view = new TableView(model); 
      model.setValue({col:2, row:1}, '123');
      view.init(); 

      const trs = document.querySelectorAll('TBODY TR'); 
      expect(trs[1].cells[2].textContent).toBe('123');
    });
  });

  describe('table header', () => {
    it('has valid column header labels', () =>{
      const numCols = 6; 
      const numRows = 10; 
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model); 
      view.init(); 

      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);

      let labelTexts = Array.from(ths).map(el => el.textContent); 
      expect(labelTexts).toEqual(['A','B','C','D','E', 'F']); 
    });
  });
});




