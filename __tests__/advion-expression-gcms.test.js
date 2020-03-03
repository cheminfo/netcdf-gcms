'use strict';

const fs = require('fs');

const netcdfGcms = require('../src');

const pathFiles = `${__dirname}/files/`;

const data = fs.readFileSync(`${pathFiles}advion-expression.cdf`);

describe('Advion Expression', () => {
  it('file example', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(60);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(60);
    }
  });
});
