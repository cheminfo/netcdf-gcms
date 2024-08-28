import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, it, expect } from 'vitest';

import { fromFinniganGCMS, netcdfGcms } from '..';

const pathFiles = `${__dirname}/data/`;

const data = readFileSync(join(pathFiles, 'finnigan-gcms.cdf'));

describe('Finnigan format', () => {
  it('Finnigan file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(11832);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(11832);
    }
  });

  it('fromFinnigan', () => {
    const json = fromFinniganGCMS(data);
    expect(json.times).toHaveLength(11832);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(11832);
    }
  });
});
