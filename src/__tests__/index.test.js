import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { netcdfGcms } from '..';

const pathFiles = `${__dirname}/data/`;

describe('netcdf-gcms test', () => {
  it('Unknown file format', () => {
    const data = readFileSync(`${pathFiles}madis-sao.nc`);
    expect(() => netcdfGcms(data)).toThrow('Unknown file format');
  });
});
