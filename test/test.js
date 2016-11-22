'use strict';

const netcdfGcms = require('..');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

describe('netcdf-gcms test', function () {

    it('Unknown file format', function () {
        const data = fs.readFileSync(pathFiles + 'madis-sao.nc');
        netcdfGcms.bind(null, data).should.throw('Unknown file format');
    });

    describe('Agilent format', function () {
        it('Agilent file', function () {
            const data = fs.readFileSync(pathFiles + 'P071.CDF');
            const json = netcdfGcms(data);
            //console.log(json);
            json.times.length.should.be.equal(6401);
            for (let i = 0; i < json.series.length; i++) {
                json.series[i].data.length.should.be.equal(6401);
            }
        });

        it('fromAgilent', function () {
            const data = fs.readFileSync(pathFiles + 'P071.CDF');
            const json = netcdfGcms.fromAgilent(data);
            json.times.length.should.be.equal(6401);
            for (let i = 0; i < json.series.length; i++) {
                json.series[i].data.length.should.be.equal(6401);
            }
        });
    });

    describe('Finnigan format', function () {
        it('Finnigan file', function () {
            const data = fs.readFileSync(pathFiles + 'SRN 00000225.cdf');
            netcdfGcms.bind(null, data).should.throw('Finnigan format not implemented yet');
        });

        /*
        it('fromFinnigan', function () {
            const data = fs.readFileSync(pathFiles + 'SRN 00000225.cdf');
            netcdfGcms.bind(null, data).should.throw('Finnigan format not implemented yet');
        });
        */
    });
});
