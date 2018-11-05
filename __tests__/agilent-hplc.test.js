'use strict';

const fs = require('fs');

const netcdfGcms = require('../src');

const pathFiles = `${__dirname}/files/`;

const data = fs.readFileSync(`${pathFiles}agilent-hplc.cdf`);

describe('Agilent format', () => {
  it('Agilent HPLC file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(4651);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(4651);
    }
  });

  it('fromAgilent HPLC', () => {
    const json = netcdfGcms.fromAgilentHPLC(data);
    expect(json.times).toHaveLength(4651);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(4651);
    }
  });
});
