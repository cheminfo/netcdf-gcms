import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { netcdfGcms, fromAgilentHPLC } from '..';

const pathFiles = `${__dirname}/data/`;

const data = readFileSync(`${pathFiles}agilent-gcms-tic.cdf`);

describe('Agilent HPLC/MS with only HPLC', () => {
  it('Agilent file', () => {
    const json = netcdfGcms(data);
    expect(json.times).toHaveLength(1645);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(1645);
    }
  });

  it('fromAgilent', () => {
    const json = fromAgilentHPLC(data);
    expect(json.times).toHaveLength(1645);
    for (let i = 0; i < json.series.length; i++) {
      expect(json.series[i].data).toHaveLength(1645);
    }
  });

  it('with meta', () => {
    const json = netcdfGcms(data);
    expect(json.meta).toStrictEqual({
      dataset_completeness: 'C1+C2',
      aia_template_revision: '1.0',
      netcdf_revision: '2.3',
      languages: 'English only',
      injection_date_time_stamp: '20190314163800+0000',
      HP_injection_time: '14 Mar 19   4:38 pm +0100',
      experiment_title: 'SequenceLine: 10  Inj: 1',
      operator_name: 'SYSTEM',
      separation_experiment_type: 'liquid chromatography',
      source_file_reference: String.raw`D:\SEP_2018\1\DATA\2019-03-14 2019-03-14 13-21-10\010-P1-B1-RMSIMONE_RSD10-005_CC1.D`,
      sample_name: 'rmsimone_RSD10-005_CC1',
      sample_id: '',
      detector_unit: 'counts',
      detection_method_name: 'RSD_1-2_A1_100-0%_20+10MIN.M',
      detector_name: 'MSD1 TIC, MS File',
      retention_unit: 'seconds',
    });
  });
});
