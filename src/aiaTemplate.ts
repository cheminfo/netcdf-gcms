import type { NetCDFReader } from 'netcdfjs';

import type { GCMSResult } from './types.ts';

/**
 * Parses a generic AIA template NetCDF file and returns times with TIC data.
 * @param reader - NetCDF reader instance
 * @returns Parsed times and series data
 */
export function aiaTemplate(reader: NetCDFReader): GCMSResult {
  const tic = reader.getDataVariable('ordinate_values') as number[];

  const delayTime = Number(reader.getDataVariable('actual_delay_time'));
  const interval = Number(reader.getDataVariable('actual_sampling_interval'));

  const time = new Array<number>(tic.length);
  for (let i = 0; i < tic.length; i++) {
    time[i] = delayTime + i * interval;
  }

  return {
    times: time,
    series: [
      {
        name: 'tic',
        dimension: 1,
        data: tic,
      },
    ],
  };
}
