'use strict';

const netcdfGcms = require('..');
const fs = require('fs');
const pathFiles = __dirname + '/files/';

const data = fs.readFileSync(pathFiles + 'P071.CDF');

describe('Agilent format', () => {
    it('Agilent file', () => {
        const json = netcdfGcms(data);
        expect(json.times.length).toBe(6401);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });

    it('fromAgilent', () => {
        const json = netcdfGcms.fromAgilent(data);
        expect(json.times.length).toBe(6401);
        for (let i = 0; i < json.series.length; i++) {
            expect(json.series[i].data.length).toBe(6401);
        }
    });

    it('with meta', () => {
        const json = netcdfGcms(data, {meta: true});
        expect(json.meta).toEqual({
            administrative_comments: '1% CH2Cl2',
            dataset_completeness: 'C1+C2',
            dataset_origin: 'Santa Clara, CA',
            experiment_date_time_stamp: '20070923040800+0200',
            experiment_title: 'P071 Essence super BP',
            experiment_type: 'Centroided Mass Spectrum',
            external_file_ref_0: 'FIRE_RTL.M',
            languages: 'English',
            ms_template_revision: '1.0.1',
            netcdf_file_date_time_stamp: '20161012052159+0200',
            netcdf_revision: '2.3.2',
            number_of_times_calibrated: 0,
            number_of_times_processed: 1,
            operator_name: 'SC',
            raw_data_intensity_format: 'Float',
            raw_data_mass_format: 'Float',
            raw_data_time_format: 'Short',
            sample_state: 'Other State',
            test_detector_type: 'Electron Multiplier',
            test_ionization_mode: 'Electron Impact',
            test_ionization_polarity: 'Positive Polarity',
            test_ms_inlet: 'Capillary Direct',
            test_resolution_type: 'Constant Resolution',
            test_scan_direction: 'Up',
            test_scan_function: 'Mass Scan',
            test_scan_law: 'Linear',
            test_separation_type: 'No Chromatography'
        });
    });
});
