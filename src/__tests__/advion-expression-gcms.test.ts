import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { netcdfGcms } from '../index.ts';

const pathFiles = join(import.meta.dirname, 'data');

test('Advion Expression', () => {
  const data = readFileSync(join(pathFiles, 'advion-expression.cdf')).buffer;
  const json = netcdfGcms(data);

  expect(json.times).toHaveLength(60);

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(60);
  }
});
