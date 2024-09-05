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

        if (field.includes('.')) {
          const segments = field.split('.');
          a[segments[0] as string] = {
            [segments[1]]: `${sort} nulls ${nulls}` as any,
          };
        } else {
          a[field] = `${sort} nulls ${nulls}` as any;
        }

        if (additionalFieldsMap[field]) {
          additionalFieldsMap[field].forEach((f) => {
            a[f] = `${sort} nulls ${nulls}` as any;
          });
        }

        return a;
      },
      {} as Record<string, 'asc' | 'desc' | Record<string, 'asc' | 'desc'>>,
    );
};
