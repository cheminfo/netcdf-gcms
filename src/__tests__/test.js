'use strict';

const fs = require('fs');

const netcdfGcms = require('..');

const pathFiles = `${__dirname}/data/`;

describe('netcdf-gcms test', () => {
  it('Unknown file format', () => {
    const data = fs.readFileSync(`${pathFiles}madis-sao.nc`);
    expect(() => netcdfGcms(data)).toThrow('Unknown file format');
  });
});
