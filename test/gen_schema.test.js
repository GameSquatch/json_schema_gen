import { expect } from 'chai';
import { genSchema } from '../dist/index.js';


const testObject = {
  field: 'value',
  innerObj: {
    innerField: 420,
  },
  myList: [1, 2, 3],
  myList2: ['a', 'b', 'c'],
  underObj: {
    oneMoreList: [{ type: 'something ' }],
  },
  arrInArr: [
    ['tup1', 'tup2'],
    ['val1', 'val2'],
  ],
};

describe('genSchema()', function () {
  it('should ouput data', function () {
    const data = JSON.stringify(genSchema(testObject));
    expect(data).to.not.be.empty;
  });
});
