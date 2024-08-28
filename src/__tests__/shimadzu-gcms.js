import { readFileSync } from 'node:fs';

import { test, expect } from 'vitest';

import { netcdfGcms } from '..';

const pathFiles = `${__dirname}/data/`;

const data = readFileSync(`${pathFiles}shimadzu-gcms.cdf`);

test('Shimadzu format', () => {
  const json = netcdfGcms(data);
  expect(json.times).toHaveLength(3820);
  for (let i = 0; i < json.series.length; i++) {
    expect(json.series[i].data).toHaveLength(3820);
  }
});
