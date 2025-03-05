# JSON Schema Gen

A very simplified generation of [2020-12 JSON Schemas](https://json-schema.org/) using an example JSON object to start with.

## Limitations (currently)

<sub>I know right, let me roast my own tool right off the bat. That'll show 'em</sub>

- None of the schema composition keywords are supported. This would be things like `allOf`, `anyOf`, and `oneOf`.
- Type constraints are not generated. This would be things like `minLength` or `pattern` for strings or `minimum` for numbers or `additionalProperties` for objects. It's only the type that this tool generates currently.
- Arrays are not scanned exhaustively; instead, only the first element of any array is inspected for a type to use under the `items` field. If that type is primitive (string, number, boolean, or null), then `items` will use a `contains` field with that type. This also means tuples are not supported.

## Things It Does Do

If I haven't steered you away with my glowing review in the section above, here is the same information from a more positive perspective.

- Traverses your entire object recursively, even into arrays and objects within arrays
- Arrays as direct children of arrays are supported
- Has no options argument, so you don't have to worry about what to pass to the function

## Usage

```js
import { genSchema } from 'json_schema_gen';
// OR
const { genSchema } = require('json_schema_gen');

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

const resultSchema = genSchema(testObject);
console.log(JSON.stringify(resultSchema, null, 2));
```
