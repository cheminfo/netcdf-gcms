'use strict';

const netcdfGcms = require('..');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

const data = fs.readFileSync(pathFiles + 'SRN 00000225.cdf');

describe('Finnigan format', () => {
    it('Finnigan file', () => {
        const json = netcdfGcms(data);
        expect(json.times.length).toBe(11832);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(11832);
        }
    });

    it('fromFinnigan', () => {
        const json = netcdfGcms.fromFinnigan(data);
        expect(json.times.length).toBe(11832);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(11832);
        }
    });
});
