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
function netcdfGcms(data, options) {
    let reader = new NetCDFReader(data);
    const globalAttributes = reader.globalAttributes;
    console.log(addMeta(globalAttributes));
    let ans;

    if (globalAttributes.find(val => val.name === 'dataset_origin')) {
        ans = agilent(reader);
    } else if (
        globalAttributes.find(val => val.name === 'source_file_format')
    ) {
        ans = finnigan(reader);
    } else if (
        globalAttributes.find(val => val.name === 'aia_template_revision')
    ) {
        ans = aiaTemplate(reader);
    } else {
        throw new TypeError('Unknown file format');
    }

    if (options && options.meta) {
        ans.meta = addMeta(globalAttributes);
    }

    if (options && options.variables) {
        ans.variables = addVariables(reader);
    }

    return ans;
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

function addMeta(globalAttributes) {
    var ans = {};
    for (const item of globalAttributes) {
        ans[item.name] = item.value;
    }
    return ans;
}

function addVariables(reader) {
    for (let variable of reader.variables) {
        variable.value = reader.getDataVariable(variable);
    }
    return reader.variables;
}

module.exports = netcdfGcms;
module.exports.fromAgilent = fromAgilent;
module.exports.fromFinnigan = fromFinnigan;
module.exports.fromAiaTemplate = fromAiaTemplate;
