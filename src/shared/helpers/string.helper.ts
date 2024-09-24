export const orderStringToObject = (
  order: string[],
  allowed: string[],
  additionalFieldsMap: Record<string, string[]> = {},
  nulls: 'first' | 'last' = 'last',
): Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>> => {
  if (!order) {
    return {};
  }

  return order
    .filter((f) => {
      const [field] = f.split(',');
      return allowed.includes(field);
    })
    .reduce(
      (a, f) => {
        const [field, sort] = f.split(',');

        const addSortToField = (fieldToAdd: string, obj: any) => {
          const segments = fieldToAdd.split('.');
          const lastSegment = segments.pop()!;
          let current = obj;

          segments.forEach((segment) => {
            if (!current[segment]) {
              current[segment] = {};
            }
            current = current[segment];
          });

          current[lastSegment] = `${sort} nulls ${nulls}`;
        };

        addSortToField(field, a);

        if (additionalFieldsMap[field]) {
          additionalFieldsMap[field].forEach((additionalField) =>
            addSortToField(additionalField, a),
          );
        }

        return a;
      },
      {} as Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>>,
    );
};
