const TableModel = require('../table_model'); 

describe('table_model', () => {
	it('can set then get a value', () => {
		const model = new TableModel();
		const location = { row: 3, col: 5 }; 

		expect(model.getValue(location)).toBeUndefined();
		
		model.setValue(location, 'foo');
		expect(model.getValue(location)).toBe('foo');
	});
});

