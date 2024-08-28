import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { netcdfGcms } from '..';

const pathFiles = `${__dirname}/data/`;

const data = readFileSync(`${pathFiles}advion-expression.cdf`);

describe('Advion Expression', () => {
  it('file example', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(60);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(60);
    }
  });
});
