import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { netcdfGcms, fromAgilentHPLC } from '..';

const pathFiles = `${__dirname}/data/`;

describe('Agilent format', () => {
  const data = readFileSync(`${pathFiles}agilent-hplc.cdf`);
  it('Agilent HPLC file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(4651);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(4651);
    }
  });

  it('fromAgilent HPLC', () => {
    const json = fromAgilentHPLC(data, { meta: true });
    expect(json.times).toHaveLength(4651);
    expect(json.series[0].name).toBe('uv254');
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(4651);
    }
  });
});

describe('Agilent format - no actual_sampling_interval', () => {
  const data = readFileSync(`${pathFiles}agilent-hplc2.cdf`);
  it('Agilent HPLC file', () => {
    const json = netcdfGcms(data, { meta: true });

    expect(json.times).toHaveLength(1645);
    expect(json.series).toHaveLength(1);
    expect(json.series[0].data).toHaveLength(1645);
    expect(json.series[0].name).toBe('tic');
  });
});
