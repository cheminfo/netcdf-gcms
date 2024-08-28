import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { netcdfGcms } from '..';

const pathFiles = `${__dirname}/data/`;

const data = readFileSync(`${pathFiles}bruker-gcms.cdf`);

describe('Agilent format', () => {
  it('Agilent file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(4513);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(4513);
    }
  });
});
