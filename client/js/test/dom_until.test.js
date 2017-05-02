const {
  removeChildren,
  createTR,
  createTH,
  createTD } = require('../dom_until');


describe('dom_until', () => {

  describe('DOM creation function', () => {
    describe('createTH', () => {
      it('produces valid TH element', () => {
        const el=createTH();
        expect(el.tagName).toBe('TH'); 
      });

      it('sets the text of the TH', () =>{
        const text = 'Minji is working on the second project'
        const el = createTR(text); 
        expect(el.textContent).toEqual(text); 
      });
    });

    describe('createTD', () => {
      it('produces valid TD element', () => {
        const el = createTD();
        expect(el.tagName).toBe('TD'); 
      });
    });

    describe('createTR', () => {
      it('produces valid TR element', () => {
        const el = createTR();
        expect(el.tagName).toBe('TR'); 
      });
    });
  });

  describe('removeChildren()', () =>{
    it('removes one child', () => {
      const parent = document.createElement('DIV'); 
      const child = document.createElement('STRONG'); 
      parent.appendChild(child); 

      expect(parent.childNodes.length).toBe(1);
      expect(parent.childNodes[0]).toBe(child);

      removeChildren(parent);

      expect(parent.childNodes.length).toBe(0);

    });
  });
});
