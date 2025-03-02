import { traverse } from 'json_traverse';

export function genSchema(sourceObject: any) {
  const schema: any = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'generated',
  };

  let selected: any = { __root: schema };
  const arrayChildRegex = /^#\d+$/;

  traverse(sourceObject, {
    objectCallback(obj, context, next) {
      const key = context.path[context.path.length - 1];
      const isNotDirectArrayChild = !arrayChildRegex.test(key);
      // Both the root and array callback create the object ahead of time
      // That's why we only do it here when that's not the case
      if (key !== '__root' && isNotDirectArrayChild) {
        selected[key] = {};
      }

      const rememberSelected = selected;
      if (isNotDirectArrayChild) {
        selected[key].type = 'object';
        selected[key].properties = {};
        selected = selected[key].properties;
      } else {
        selected.type = 'object';
        selected.properties = {};
        selected = selected.properties;
      }
      next();
      selected = rememberSelected;
    },
    arrayCallback(arr, context, next) {
      const key = context.path[context.path.length - 1];
      const isNotDirectArrayChild = !arrayChildRegex.test(key);

      if (isNotDirectArrayChild) {
        selected[key] = {};
        selected[key].type = 'array';

        if (arr.length > 0) {
          const firstItem = arr[0];
          const isComplexItem = typeof firstItem === 'object' || Array.isArray(firstItem);
          selected[key].items = {};

          if (isComplexItem) {
            const rememberSelected = selected;
            selected = selected[key].items;
            next((_, index) => index === 0);
            selected = rememberSelected;
          } else {
            selected[key].items.contains = typeof firstItem;
          }
        }
      } else {
        selected.type = 'array';
        if (arr.length > 0) {
          const firstItem = arr[0];
          const isComplexItem = typeof firstItem === 'object' || Array.isArray(firstItem);
          selected.items = {};

          if (isComplexItem) {
            const rememberSelected = selected;
            selected = selected.items;
            next((_, index) => index === 0);
            selected = rememberSelected;
          } else {
            selected.items.contains = typeof firstItem;
          }
        }
      }
    },
    primitiveCallback(primitive, context) {
      const key = context.path[context.path.length - 1];
      selected[key] = {};
      selected[key].type = primitive === null ? 'null' : typeof primitive;
    },
  });

  return schema;
}
