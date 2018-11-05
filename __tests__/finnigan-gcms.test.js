'use strict';

const fs = require('fs');
const join = require('path').join;

const netcdfGcms = require('../src');

const pathFiles = `${__dirname}/files/`;

const data = fs.readFileSync(join(pathFiles, 'finnigan-gcms.cdf'));

describe('Finnigan format', () => {
  it('Finnigan file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(11832);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(11832);
    }
  });

  it('fromFinnigan', () => {
    const json = netcdfGcms.fromFinniganGCMS(data);
    expect(json.times).toHaveLength(11832);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(11832);
    }
  });
});
