import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromFinniganGCMS, netcdfGcms } from '../index.ts';

const pathFiles = join(import.meta.dirname, 'data');

test('Finnigan format - Finnigan file', () => {
  const data = readFileSync(join(pathFiles, 'finnigan-gcms.cdf')).buffer;
  const json = netcdfGcms(data);

  expect(json.times).toHaveLength(11832);

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(11832);
  }
});

test('Finnigan format - fromFinnigan', () => {
  const data = readFileSync(join(pathFiles, 'finnigan-gcms.cdf')).buffer;
  const json = fromFinniganGCMS(data);

  expect(json.times).toHaveLength(11832);

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(11832);
  }
});
