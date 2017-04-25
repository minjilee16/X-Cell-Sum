const TableModel = require('./table_model');
const TableView = require('./table_view');


const model = new TableModel(); 
const tableView = new TableView(model); 
tableView.init(); 

