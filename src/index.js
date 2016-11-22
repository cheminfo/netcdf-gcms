'use strict';

const NetCDFReader = require('netcdfjs');
const agilent = require('./agilent');
const finnigan = require('./finnigan');

function netcdfGcms(data) {
    let reader = new NetCDFReader(data);
    const globalAttributes = reader.globalAttributes;

    if (globalAttributes.find(val => val.name === 'dataset_origin')) {
        return agilent(reader);
    } else if (globalAttributes.find(val => val.name === 'source_file_format')) {
        return finnigan(reader);
    } else {
        throw new TypeError('Unknown file format');
    }
}

function fromAgilent(data) {
    return agilent(new NetCDFReader(data));
}

function fromFinnigan(data) {
    return finnigan(new NetCDFReader(data));
}

module.exports = netcdfGcms;
module.exports.fromAgilent = fromAgilent;
module.exports.fromFinnigan = fromFinnigan;
