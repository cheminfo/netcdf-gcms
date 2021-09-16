'use strict';

const fs = require('fs');

const netcdfGcms = require('..');

const pathFiles = `${__dirname}/data/`;

const data = fs.readFileSync(`${pathFiles}shimadzu-gcms.cdf`);

test('Shimadzu format', () => {
  const json = netcdfGcms(data);
  expect(json.times).toHaveLength(3820);
  for (let i = 0; i < json.series.length; i++) {
    expect(json.series[i].data).toHaveLength(3820);
  }
});
