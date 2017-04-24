const { getRange,letterGetRange } = require('../array_until'); 

describe('array_until', () => {
	describe('getRange()', () => {
		it('produces a valid range from integar number 3 to 6', () => {
			expect(getRange(3,6)).toEqual([3,4,5,6]); 
		});

		it('produces a valid range from -10 to 8', () => {
			expect(getRange(-10,-8)).toEqual([-10, -9, -8]);
		});

		it('produces a valid range from 0 to 3', () => {
			expect(getRange(0,3)).toEqual([0,1,2,3]);
		})
	});


	describe('letterGetRange', () => {
		it('produces a value range from letter A to C', () => {
			expect(letterGetRange("A",2)).toEqual(["A","B"]);
		});

		it('produces a value range from letter C to F', () => {
			expect(letterGetRange("C",4)).toEqual(["C","D","E","F"]);
		});
	});
});