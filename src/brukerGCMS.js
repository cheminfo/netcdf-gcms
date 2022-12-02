'use strict';

/* reader.toString() provides the following information
    GLOBAL ATTRIBUTES
      dataset_completeness           = C1+C2
      ms_template_revision           = 1.0.1
      netcdf_revision                = 2.3.2
      languages                      = English
      netcdf_file_date_time_stamp    = 20170428032023+0000
      experiment_title               = MS51762A16
    11829FC03_3__60_40
      experiment_date_time_stamp     = 20160930202145-0001
      operator_name                  = Begemann/Eikenberg/Roettger
      pre_experiment_program_name    = otofControl 3.4.16.0
      post_experiment_program_name   = Bruker Compass DataAnalysis 4.2
      source_file_reference          = X:\2016\MS5\1700\MS51762A16.d
      source_file_format             = Bruker Daltonics Data File
      experiment_type                = Centroided Mass Spectrum
      sample_state                   = Other State
      test_separation_type           = No Chromatography
      test_ms_inlet                  = Direct Inlet Probe
      test_ionization_mode           = Electrospray Ionization
      test_ionization_polarity       = Positive Polarity
      test_detector_type             = Electron Multiplier
      test_resolution_type           = Proportional Resolution
      test_scan_function             = Mass Scan
      test_scan_direction            = Up
      test_scan_law                  = Linear
      raw_data_mass_format           = Double
      raw_data_time_format           = Float
      raw_data_intensity_format      = Float
      units                          = Seconds
      scale_factor                   = 1

    VARIABLES:
      error_log                      = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 64)
      a_d_sampling_rate              = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4513)
      a_d_coaddition_factor          = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4514)
      scan_acquisition_time          = [0.329,0.73,1.132,1.534,1.936,2.337,2.739,3.14,3.5 (length: 4513)
      scan_duration                  = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4513)
      inter_scan_time                = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4513)
      resolution                     = [106.6623112889557,110.7855343519544,104.407495112 (length: 4513)
      actual_scan_number             = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34, (length: 4513)
      total_intensity                = [5297.4945068359375,6172.123912811279,5934.7557412 (length: 4513)
      mass_range_min                 = [49.99999997418507,49.99999997418507,49.9999999741 (length: 4513)
      mass_range_max                 = [1599.9999564432276,1599.9999564432276,1599.999956 (length: 4513)
      time_range_min                 = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4513)
      time_range_max                 = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 4513)
      scan_index                     = [0,60,128,195,265,324,399,472,542,596,671,738,803, (length: 4513)
      point_count                    = [60,68,67,70,59,75,73,70,54,75,67,65,64,73,56,69,6 (length: 4513)
      flag_count                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 4513)
      mass_values                    = [51.53516375878996,95.32974890044508,106.334477231 (length: 1176507)
      intensity_values               = [76.99999237060547,80,90,78.99799346923828,80.9352 (length: 1176507)
      instrument_name                = ["m","i","c","r","O","T","O","F",""," "," "," ","  (length: 32)
      instrument_id                  = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_mfr                 = ["B","r","u","k","e","r"," ","D","a","l","t","o"," (length: 32)
      instrument_model               = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_serial_no           = ["2","1","3","7","5","0",".","1","0","3","5","9"," (length: 32)
      instrument_sw_version          = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_fw_version          = [""," "," "," "," "," "," "," "," "," "," "," ","  (length: 32)
      instrument_os_version          = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_app_version         = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
      instrument_comments            = [" "," "," "," "," "," "," "," "," "," "," "," "," (length: 32)
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
