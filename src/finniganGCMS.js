'use strict';

/* reader.toString() provides the following information
    GLOBAL ATTRIBUTES
      dataset_completeness           = C1+C2
      ms_template_revision           = 1.0.1
      administrative_comments        =
      dataset_owner                  =
      experiment_title               =
      experiment_date_time_stamp     = 20150902041002+0100
      netcdf_file_date_time_stamp    = 20151026063419+0000
      experiment_type                = Centroided Mass Spectrum
      netcdf_revision                = 2.3.2
      operator_name                  = DSQ
      source_file_reference          = G:\FCO\FCO_CIO\K2\MP2013\T1 IL database 2013\9. IL Data Entry\12_HU_HIFS\IL database\RAW data\Lukoil-Disel-150901.RAW
      source_file_date_time_stamp    = 20150902041002+0100
      source_file_format             = Finnigan
      languages                      = English
      external_file_ref_0            =
      instrument_number              = 1
      sample_prep_comments           =
      sample_comments                = Lukoil Disel 0,5 % CS2 1 % inkt
      test_separation_type           =
      test_ms_inlet                  =
      test_ionization_mode           =
      test_ionization_polarity       = Positive Polarity
      test_detector_type             = Conversion Dynode Electron Multiplier
      test_scan_function             = Mass Scan
      test_scan_direction            =
      test_scan_law                  = Linear
      number_of_scans                = 11832
      raw_data_mass_format           = Double
      raw_data_intensity_format      = Long
      actual_run_time                = 3519.6410000000005
      actual_delay_time              = 82.328
      global_mass_min                = 0
      global_mass_max                = 450
      calibrated_mass_min            = 0
      calibrated_mass_max            = 0
      mass_axis_label                = M/Z
      intensity_axis_label           = Abundance

    VARIABLES:
      error_log                      = ["","","","","","","","","","","","","","","",""," (length: 64)
      instrument_name                = ["L","C","Q","","","","","","","","","","","",""," (length: 32)
      instrument_id                  = ["","","","","","","","","","","","","","","",""," (length: 32)
      instrument_mfr                 = ["F","i","n","n","i","g","a","n","-","M","A","T"," (length: 32)
      instrument_model               = ["","","","","","","","","","","","","","","",""," (length: 32)
      instrument_sw_version          = ["3",".","1","","","","","","","","","","","",""," (length: 32)
      instrument_os_version          = ["W","i","n","d","o","w","s"," ","V","i","s","t"," (length: 32)
      scan_index                     = [0,34,74,113,145,177,211,239,267,299,341,374,400,4 (length: 11832)
      point_count                    = [34,40,39,32,32,34,28,28,32,42,33,26,29,34,31,28,2 (length: 11832)
      flag_count                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 11832)
      a_d_sampling_rate              = [1000,1000,1000,1000,1000,1000,1000,1000,1000,1000 (length: 11832)
      scan_acquisition_time          = [82.328,82.625,82.76599999999999,83.063,83.188,83. (length: 11832)
      scan_duration                  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 11832)
      mass_range_min                 = [35,16,35,16,35,16,35,16,35,16,35,16,35,16,35,16,3 (length: 11832)
      mass_range_max                 = [450,150,450,150,450,150,450,150,450,150,450,150,4 (length: 11832)
      scan_type                      = [65537,65537,65537,65537,65537,65537,65537,65537,6 (length: 11832)
      resolution                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 11832)
      total_intensity                = [375220,1054339,228245,576718,58280,288629,29815,1 (length: 11832)
      mass_values                    = [36.3023681640625,36.98402404785156,38.08326721191 (length: 1366002)
      intensity_values               = [335,287,331,266,2423,448,9009,833,261,661,4003,21 (length: 1366002)

*/

function finniganGCMS(reader) {
  const time = reader.getDataVariable('scan_acquisition_time');
  const tic = reader.getDataVariable('total_intensity');

  // variables to get the mass-intensity values
  let scanIndex = reader.getDataVariable('scan_index');
  const massValues = reader.getDataVariable('mass_values');
  const intensityValues = reader.getDataVariable('intensity_values');
  scanIndex.push(massValues.length);

  let ms = new Array(time.length);
  let index = 0;
  for (let i = 0; i < ms.length; i++) {
    let size = scanIndex[i + 1] - scanIndex[i];
    ms[i] = [new Array(size), new Array(size)];

    for (let j = 0; j < size; j++) {
      ms[i][0][j] = massValues[index];
      ms[i][1][j] = intensityValues[index++];
    }
  }

  return {
    times: time,
    series: [
      {
        name: 'tic',
        dimension: 1,
        data: tic,
      },
      {
        name: 'ms',
        dimension: 2,
        data: ms,
      },
    ],
  };
}

module.exports = finniganGCMS;
