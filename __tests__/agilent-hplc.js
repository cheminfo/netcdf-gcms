'use strict';

const netcdfGcms = require('../src');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

const data = fs.readFileSync(pathFiles + 'agilent-hplc.cdf');

describe('Agilent format', () => {
    it('Agilent file', () => {
        const json = netcdfGcms(data);
        expect(json.times.length).toBe(4651);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });

    it('fromAgilent', () => {
        const json = netcdfGcms.fromAgilent(data);
        expect(json.times.length).toBe(4651);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });

    it('with meta', () => {
        const json = netcdfGcms(data, {meta: true, variables: true});
        expect(json.meta).toEqual({
            HP_injection_time: '30-Oct-18, 17:43:05',
            aia_template_revision: '1.0',
            dataset_completeness: 'C1+C2',
            detection_method_name: 'POS 3 IC 90-10 31 MIN.M',
            detector_name: 'DAD1 A, Sig=254,4 Ref=360,100',
            detector_unit: 'mAU',
            experiment_title: 'SequenceLine: 1  Inj: 1',
            injection_date_time_stamp: '20181030174305+0000',
            languages: 'English only',
            netcdf_revision: '2.3',
            operator_name: 'SYSTEM',
            retention_unit: 'seconds',
            sample_id: '',
            sample_name: 'MW-2-6-6 IC 90',
            separation_experiment_type: 'liquid chromatography',
            source_file_reference:
                'C:\\CHEM32\\1\\DATA\\MINGMING\\MW-1-MEO-I IC-90 2018-10-30 17-42-13\\MW-2-6-6 IC 90.D'
        });
    });
});
