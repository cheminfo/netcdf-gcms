import { NetCDFReader } from 'netcdfjs';

import { advionGCMS } from './advionGCMS';
import { agilentGCMS } from './agilentGCMS';
import { agilentHPLC } from './agilentHPLC';
import { aiaTemplate } from './aiaTemplate';
import { brukerGCMS } from './brukerGCMS';
import { finniganGCMS } from './finniganGCMS';
import { shimadzuGCMS } from './shimadzuGCMS';

/**
 * Reads a NetCDF file and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns {{times, series, meta, variables}} - JSON with the time, TIC and mass spectra values
 */
export function netcdfGcms(data) {
  let reader = new NetCDFReader(data);
  const globalAttributes = reader.globalAttributes;

  const instrument_mfr =
    reader.dataVariableExists('instrument_mfr') &&
    reader.getDataVariableAsString('instrument_mfr');
  const dataset_origin = reader.attributeExists('dataset_origin');
  const mass_values = reader.dataVariableExists('mass_values');
  const detector_name = reader.getAttribute('detector_name');
  const aia_template_revision = reader.attributeExists('aia_template_revision');
  const source_file_format = reader.getAttribute('source_file_format');

  let result;

  if (mass_values && dataset_origin) {
    result = agilentGCMS(reader);
  } else if (
    mass_values &&
    instrument_mfr &&
    instrument_mfr.match(/finnigan/i)
  ) {
    result = finniganGCMS(reader);
  } else if (mass_values && instrument_mfr && instrument_mfr.match(/bruker/i)) {
    result = brukerGCMS(reader);
  } else if (
    mass_values &&
    source_file_format &&
    source_file_format.match(/shimadzu/i)
  ) {
    result = shimadzuGCMS(reader);
  } else if (
    mass_values &&
    source_file_format &&
    source_file_format.match(/advion/i)
  ) {
    result = advionGCMS(reader);
  } else if (detector_name && detector_name.match(/(dad|tic)/i)) {
    // diode array agilent HPLC
    result = agilentHPLC(reader);
  } else if (aia_template_revision) {
    result = aiaTemplate(reader);
  } else {
    throw new TypeError('Unknown file format');
  }

  result.meta = addMeta(globalAttributes);
  result.variables = addVariables(reader);

  return result;
}

/**
 * Reads a NetCDF file with Agilent GCMS format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns {{times, series}} - JSON with the time, TIC and mass spectra values
 */
export function fromAgilentGCMS(data) {
  return agilentGCMS(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Agilent HPLC format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns {{times, series}} - JSON with the time, TIC and mass spectra values
 */
export function fromAgilentHPLC(data) {
  return agilentHPLC(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Finnigan format and returns a formatted JSON with the data from it
 * @param {ArrayBuffer} data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns {{times, series}} - JSON with the time, TIC and mass spectra values
 */
export function fromFinniganGCMS(data) {
  return finniganGCMS(new NetCDFReader(data));
}

export function fromAiaTemplate(data) {
  return aiaTemplate(new NetCDFReader(data));
}

function addMeta(globalAttributes) {
  let meta = {};
  for (const item of globalAttributes) {
    meta[item.name] = item.value;
  }
  return meta;
}

function addVariables(reader) {
  for (let variable of reader.variables) {
    variable.value = reader.getDataVariable(variable);
  }
  return reader.variables;
}
