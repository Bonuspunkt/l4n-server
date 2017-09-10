require('tap').mochaGlobals()
const { expect } = require('chai');

const route = require('./route');

describe('route', () => {

    it('should match simple route', () => {
        const check = route('/:text');

        expect(check('/some string')).to.deep.equal({ text: 'some string' });
        expect(check('/')).to.equal(undefined);
    });

    it('should match based on type', () => {
        const check = route('/:id!number');

        expect(check('/1')).to.deep.equal({ id: 1 });
        expect(check('/a')).to.deep.equal(undefined);
    });

    it('should handle multiple parameters', () => {
        const check = route('/:a/:b/:c');

        expect(check('/1/2/3')).to.deep.equal({ a: '1', b: '2', c: '3' });
        expect(check('/1/2/')).to.deep.equal(undefined);
    });

    it('should handle optional parameter', () => {
        const check = route('/:a?');

        expect(check('/')).to.deep.equal({});
        expect(check('/b')).to.deep.equal({ a: 'b' });
    });

    it('should handle paramType any', () => {
        const check = route('/:string!any');

        expect(check('/a/b')).to.deep.equal({ string: 'a/b' });
    });

});
