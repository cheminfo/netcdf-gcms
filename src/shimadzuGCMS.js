'use strict';

/* reader.toString() provides the following information
    GLOBAL ATTRIBUTES
      dataset_completeness           = C1+C2
      ms_template_revision           = 1.0.1
      netcdf_revision                = 2.3.2
      languages                      = English
      administrative_comments        =
      netcdf_file_date_time_stamp    = 20180913165502+0000
      experiment_title               =
      experiment_date_time_stamp     = 20180910165319+0000
      operator_name                  = Admin
      source_file_reference          = D:\GCMSsolution\Data\Chromatograms\Cato\bormann_CB000_Test2.qgd
      source_file_format             = Shimadzu GCMSsolution
      source_file_date_time_stamp    = 20180910165319+0000
      experiment_type                = Centroided Mass Spectrum
      sample_internal_id             =
      sample_comments                =
      sample_state                   = Other State
      test_separation_type           = Gas-Solid Chromatography
      test_ms_inlet                  = Other Probe
      test_ionization_mode           = Electron Impact
      test_ionization_polarity       = Positive Polarity
      test_electron_energy           = 70
      test_detector_type             = Electron Multiplier
      test_resolution_type           = Constant Resolution
      test_scan_function             = Mass Scan
      test_scan_direction            = Up
      test_scan_law                  = Quadratic
      test_scan_time                 = 0
      raw_data_mass_format           = Double
      raw_data_time_format           = Long
      raw_data_intensity_format      = Long
      units                          = Seconds
      scale_factor                   = 1
      long_name                      = Seconds
      starting_scan_number           = 0
      actual_run_time_length         = 1289
      actual_delay_time              = 0
      raw_data_uniform_sampling_flag = 1

    VARIABLES:
      error_log                      = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 64)
      a_d_sampling_rate              = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      a_d_coaddition_factor          = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      scan_acquisition_time          = [144,144.3,144.6,144.9,145.2,145.5,145.8,146.1,146 (length: 3820)
      scan_duration                  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      inter_scan_time                = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      resolution                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      actual_scan_number             = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,2 (length: 3820)
      total_intensity                = [63566,61702,61873,59738,58321,59001,59364,59871,6 (length: 3820)
      mass_range_min                 = [35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,35,3 (length: 3820)
      mass_range_max                 = [500,500,500,500,500,500,500,500,500,500,500,500,5 (length: 3820)
      time_range_min                 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      time_range_max                 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      scan_index                     = [0,466,932,1398,1863,2329,2795,3260,3726,4192,4658 (length: 3820)
      point_count                    = [466,466,466,465,466,466,465,466,466,466,466,466,4 (length: 3820)
      flag_count                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 3820)
      mass_values                    = [35,36,37.1,38.1,39.1,40.15,41.1,42.1,43.15,44.1,4 (length: 1779397)
      intensity_values               = [26,111,412,785,3098,485,5772,7391,11213,711,687,1 (length: 1779397)
      instrument_name                = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_id                  = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_mfr                 = ["S","h","i","m","a","d","z","u"," ","C","o","r"," (length: 32)
      instrument_model               = ["G","C","M","S","","","","","","","","","","","", (length: 32)
      instrument_serial_no           = ["","","","","","","","","","","","","","","",""," (length: 32)
      instrument_sw_version          = ["4",".","2","0","","","","","","","","","","","", (length: 32)
      instrument_fw_version          = ["G","C","M","S","-","Q","P","2","0","1","0","1"," (length: 32)
      instrument_os_version          = ["W","i","n","d","o","w","s","","","","","","","", (length: 32)
      instrument_app_version         = ["G","C","M","S","s","o","l","u","t","i","o","n"," (length: 32)
      instrument_comments            = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
*/

function shimadzuGCMS(reader) {
  const time = reader.getDataVariable('scan_acquisition_time');
  const tic = reader.getDataVariable('total_intensity');

  // variables to get the mass-intensity values
  let scanIndex = reader.getDataVariable('scan_index');
  const massValues = reader.getDataVariable('mass_values');
  const intensityValues = reader.getDataVariable('intensity_values');
  scanIndex.push(massValues.length);

  var ms = new Array(time.length);
  var index = 0;
  for (var i = 0; i < ms.length; i++) {
    var size = scanIndex[i + 1] - scanIndex[i];
    ms[i] = [new Array(size), new Array(size)];

    for (var j = 0; j < size; j++) {
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
        data: tic
      },
      {
        name: 'ms',
        dimension: 2,
        data: ms
      }
    ]
  };
}

module.exports = shimadzuGCMS;
