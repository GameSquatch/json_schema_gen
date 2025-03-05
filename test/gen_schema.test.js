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
  const data = genSchema(testObject);

  it('should make root an object', function () {
    expect(data.type).to.equal('object');
    expect(data).to.haveOwnProperty('properties');
  });

  it('should make field a string', function () {
    expect(data.properties.field.type).to.equal('string');
  });

  it('should handle nested arrays', function () {
    expect(data.properties.arrInArr.items.items.contains).to.equal('string');
  });

  it('should handle objects in arrays', function () {
    expect(data.properties.underObj.properties.oneMoreList.items.type).to.equal('object');
  });
});
