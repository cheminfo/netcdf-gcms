'use strict';

const NetCDFReader = require('netcdfjs');
const agilent = require('./agilent');
const finnigan = require('./finnigan');
const aiaTemplate = require('./aiaTemplate');

/**
 * Reads a NetCDF file and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function netcdfGcms(data) {
    let reader = new NetCDFReader(data);
    const globalAttributes = reader.globalAttributes;

    if (globalAttributes.find(val => val.name === 'dataset_origin')) {
        return agilent(reader);
    } else if (globalAttributes.find(val => val.name === 'source_file_format')) {
        return finnigan(reader);
    } else if (globalAttributes.find(val => val.name === 'aia_template_revision')) {
        return aiaTemplate(reader);
    } else {
        throw new TypeError('Unknown file format');
    }
}

/**
 * Reads a NetCDF file with Agilent format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function fromAgilent(data) {
    return agilent(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Finnigan format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function fromFinnigan(data) {
    return finnigan(new NetCDFReader(data));
}

function fromAiaTemplate(data) {
    return aiaTemplate(new NetCDFReader(data));
}

module.exports = netcdfGcms;
module.exports.fromAgilent = fromAgilent;
module.exports.fromFinnigan = fromFinnigan;
module.exports.fromAiaTemplate = fromAiaTemplate;
