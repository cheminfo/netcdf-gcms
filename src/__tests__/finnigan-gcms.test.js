

const fs = require('fs');
const join = require('path').join;

const netcdfGcms = require('..');

const pathFiles = `${__dirname}/data/`;

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
