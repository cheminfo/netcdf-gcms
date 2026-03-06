import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { fromAgilentHPLC, netcdfGcms } from '../index.ts';

const pathFiles = join(import.meta.dirname, 'data');

test('Agilent HPLC file', () => {
  const data = readFileSync(join(pathFiles, 'agilent-hplc.cdf')).buffer;
  const json = netcdfGcms(data);

  expect(json.times).toHaveLength(4651);

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(4651);
  }
});

test('fromAgilent HPLC', () => {
  const data = readFileSync(join(pathFiles, 'agilent-hplc.cdf')).buffer;
  const json = fromAgilentHPLC(data);

  expect(json.times).toHaveLength(4651);
  expect(json.series[0]!.name).toBe('uv254');

  for (const seriesItem of json.series) {
    expect(seriesItem.data).toHaveLength(4651);
  }
});

test('Agilent HPLC - no actual_sampling_interval', () => {
  const data = readFileSync(join(pathFiles, 'agilent-hplc2.cdf')).buffer;
  const json = netcdfGcms(data);

  expect(json.times).toHaveLength(1645);
  expect(json.series).toHaveLength(1);
  expect(json.series[0]!.data).toHaveLength(1645);
  expect(json.series[0]!.name).toBe('tic');
});
