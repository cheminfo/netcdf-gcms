import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { netcdfGcms } from '../index.ts';

const pathFiles = join(import.meta.dirname, 'data');

test('Bruker format', () => {
  const data = readFileSync(join(pathFiles, 'bruker-gcms.cdf')).buffer;
  const json = netcdfGcms(data);

  expect(json.times).toHaveLength(4513);

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(4513);
  }
});
