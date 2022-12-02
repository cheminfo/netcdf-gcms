'use strict';

const { NetCDFReader } = require('netcdfjs');

const advionGCMS = require('./advionGCMS');
const agilentGCMS = require('./agilentGCMS');
const agilentHPLC = require('./agilentHPLC');
const aiaTemplate = require('./aiaTemplate');
const brukerGCMS = require('./brukerGCMS');
const finniganGCMS = require('./finniganGCMS');
const shimadzuGCMS = require('./shimadzuGCMS');

/**
 * Reads a NetCDF file and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @param {object} [options={}]
 * @param {boolean} [options.meta] - add meta information
 * @param {boolean} [options.variables] -add variables information
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function netcdfGcms(data, options = {}) {
  let reader = new NetCDFReader(data);
  const globalAttributes = reader.globalAttributes;

  let instrument_mfr =
    reader.dataVariableExists('instrument_mfr') &&
    reader.getDataVariableAsString('instrument_mfr');
  let dataset_origin = reader.attributeExists('dataset_origin');
  let mass_values = reader.dataVariableExists('mass_values');
  let detector_name = reader.getAttribute('detector_name');
  let aia_template_revision = reader.attributeExists('aia_template_revision');
  let source_file_format = reader.getAttribute('source_file_format');

  let ans;

  if (mass_values && dataset_origin) {
    ans = agilentGCMS(reader);
  } else if (
    mass_values &&
    instrument_mfr &&
    instrument_mfr.match(/finnigan/i)
  ) {
    ans = finniganGCMS(reader);
  } else if (mass_values && instrument_mfr && instrument_mfr.match(/bruker/i)) {
    ans = brukerGCMS(reader);
  } else if (
    mass_values &&
    source_file_format &&
    source_file_format.match(/shimadzu/i)
  ) {
    ans = shimadzuGCMS(reader);
  } else if (
    mass_values &&
    source_file_format &&
    source_file_format.match(/advion/i)
  ) {
    ans = advionGCMS(reader);
  } else if (detector_name && detector_name.match(/(dad|tic)/i)) {
    // diode array agilent HPLC
    ans = agilentHPLC(reader);
  } else if (aia_template_revision) {
    ans = aiaTemplate(reader);
  } else {
    throw new TypeError('Unknown file format');
  }

  if (options.meta) {
    ans.meta = addMeta(globalAttributes);
  }

  if (options.variables) {
    ans.variables = addVariables(reader);
  }

  return ans;
}

/**
 * Reads a NetCDF file with Agilent GCMS format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function fromAgilentGCMS(data) {
  return agilentGCMS(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Agilent HPLC format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function fromAgilentHPLC(data) {
  return agilentHPLC(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Finnigan format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @return {{times, series}} - JSON with the time, TIC and mass spectra values
 */
function fromFinniganGCMS(data) {
  return finniganGCMS(new NetCDFReader(data));
}

function fromAiaTemplate(data) {
  return aiaTemplate(new NetCDFReader(data));
}

function addMeta(globalAttributes) {
  let ans = {};
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
module.exports.fromAgilentGCMS = fromAgilentGCMS;
module.exports.fromAgilentHPLC = fromAgilentHPLC;
module.exports.fromFinniganGCMS = fromFinniganGCMS;
module.exports.fromAiaTemplate = fromAiaTemplate;
