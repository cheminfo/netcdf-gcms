'use strict';

const NetCDFReader = require('netcdfjs');
const agilent = require('./agilent');

function netcdfGcms(data) {
    let reader = new NetCDFReader(data);
    const globalAttributes = reader.globalAttributes;

    if (globalAttributes.find(val => val.name === 'dataset_origin')) {
        return agilent(reader);
    } else if (globalAttributes.find(val => val.name === 'source_file_format')) {
        throw new TypeError('Finnigan format not implemented yet');
    } else {
        throw new TypeError('Unknown file format');
    }
}

function fromAgilent(data) {
    return agilent(new NetCDFReader(data));
}

module.exports = netcdfGcms;
module.exports.fromAgilent = fromAgilent;
