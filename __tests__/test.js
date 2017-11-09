'use strict';

const netcdfGcms = require('..');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

describe('netcdf-gcms test', () => {
    it('Unknown file format', () => {
        const data = fs.readFileSync(pathFiles + 'madis-sao.nc');
        expect(() => netcdfGcms(data)).toThrow('Unknown file format');
    });
});
