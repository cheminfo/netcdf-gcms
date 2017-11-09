'use strict';

const netcdfGcms = require('..');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

const data = fs.readFileSync(pathFiles + 'P071.CDF');

describe('Agilent format', () => {
    it('Agilent file', () => {
        const json = netcdfGcms(data);
        expect(json.times.length).toBe(6401);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });

    it('fromAgilent', () => {
        const json = netcdfGcms.fromAgilent(data);
        expect(json.times.length).toBe(6401);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });
});
