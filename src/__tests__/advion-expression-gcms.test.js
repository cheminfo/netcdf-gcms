'use strict';

const fs = require('fs');

const netcdfGcms = require('..');

const pathFiles = `${__dirname}/data/`;

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
