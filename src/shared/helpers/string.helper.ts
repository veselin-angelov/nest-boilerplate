export const orderStringToObject = (
  order: string[],
  allowed: string[],
  additionalFieldsMap: Record<string, string[]> = {},
  nulls: 'first' | 'last' = 'last',
): Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>> => {
  return order
    .filter((f) => {
      const [field] = f.split(',');
      return allowed.includes(field);
    })
    .reduce(
      (a, f) => {
        const [field, sort] = f.split(',');

        const addSortToField = (fieldToAdd: string) => {
          if (fieldToAdd.includes('.')) {
            const segments = fieldToAdd.split('.');
            if (!a[segments[0]]) {
              a[segments[0]] = {};
            }
            (a[segments[0]] as Record<string, string>)[segments[1]] =
              `${sort} nulls ${nulls}`;
          } else {
            a[fieldToAdd] = `${sort} nulls ${nulls}` as any;
          }
        };

        addSortToField(field);

        if (additionalFieldsMap[field]) {
          additionalFieldsMap[field].forEach(addSortToField);
        }

        return a;
      },
      {} as Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>>,
    );
};
