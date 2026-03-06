import { NetCDFReader } from 'netcdfjs';

import { advionGCMS } from './advionGCMS.ts';
import { agilentGCMS } from './agilentGCMS.ts';
import { agilentHPLC } from './agilentHPLC.ts';
import { aiaTemplate } from './aiaTemplate.ts';
import { brukerGCMS } from './brukerGCMS.ts';
import { finniganGCMS } from './finniganGCMS.ts';
import { shimadzuGCMS } from './shimadzuGCMS.ts';
import type { NetcdfGcmsResult, VariableWithValue } from './types.ts';

export type { GCMSResult, NetcdfGcmsResult, Series } from './types.ts';

/**
 * Reads a NetCDF file and returns a formatted JSON with the data from it.
 * @param data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns JSON with the time, TIC and mass spectra values
 */
export function netcdfGcms(data: ArrayBuffer): NetcdfGcmsResult {
  const reader = new NetCDFReader(data);
  const globalAttributes = reader.globalAttributes;

  const instrumentMfr =
    reader.dataVariableExists('instrument_mfr') &&
    reader.getDataVariableAsString('instrument_mfr');
  const datasetOrigin = reader.attributeExists('dataset_origin');
  const massValues = reader.dataVariableExists('mass_values');
  const detectorName = reader.getAttribute('detector_name');
  const aiaTemplateRevision = reader.attributeExists('aia_template_revision');
  const sourceFileFormat = reader.getAttribute('source_file_format');

  let result;

  if (massValues && datasetOrigin) {
    result = agilentGCMS(reader);
  } else if (massValues && instrumentMfr && instrumentMfr.match(/finnigan/i)) {
    result = finniganGCMS(reader);
  } else if (massValues && instrumentMfr && instrumentMfr.match(/bruker/i)) {
    result = brukerGCMS(reader);
  } else if (
    massValues &&
    sourceFileFormat &&
    String(sourceFileFormat).match(/shimadzu/i)
  ) {
    result = shimadzuGCMS(reader);
  } else if (
    massValues &&
    sourceFileFormat &&
    String(sourceFileFormat).match(/advion/i)
  ) {
    result = advionGCMS(reader);
  } else if (detectorName && String(detectorName).match(/(?:dad|tic)/i)) {
    result = agilentHPLC(reader);
  } else if (aiaTemplateRevision) {
    result = aiaTemplate(reader);
  } else {
    throw new TypeError('Unknown file format');
  }

  return {
    ...result,
    meta: addMeta(globalAttributes),
    variables: addVariables(reader),
  };
}

/**
 * Reads a NetCDF file with Agilent GCMS format and returns a formatted JSON with the data from it.
 * @param data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns JSON with the time, TIC and mass spectra values
 */
export function fromAgilentGCMS(data: ArrayBuffer) {
  return agilentGCMS(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Agilent HPLC format and returns a formatted JSON with the data from it.
 * @param data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns JSON with the time, TIC and mass spectra values
 */
export function fromAgilentHPLC(data: ArrayBuffer) {
  return agilentHPLC(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with Finnigan format and returns a formatted JSON with the data from it.
 * @param data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns JSON with the time, TIC and mass spectra values
 */
export function fromFinniganGCMS(data: ArrayBuffer) {
  return finniganGCMS(new NetCDFReader(data));
}

/**
 * Reads a NetCDF file with AIA template format and returns a formatted JSON with the data from it.
 * @param data - ArrayBuffer or any Typed Array (including Node.js' Buffer from v4) with the data
 * @returns JSON with the time, TIC and mass spectra values
 */
export function fromAiaTemplate(data: ArrayBuffer) {
  return aiaTemplate(new NetCDFReader(data));
}

function addMeta(
  globalAttributes: Array<{ name: string; value: string | number }>,
): Record<string, string | number> {
  const meta: Record<string, string | number> = {};
  for (const item of globalAttributes) {
    meta[item.name] = item.value;
  }
  return meta;
}

function addVariables(reader: NetCDFReader): VariableWithValue[] {
  return reader.variables.map((variable) => ({
    ...variable,
    value: reader.getDataVariable(variable),
  }));
}
