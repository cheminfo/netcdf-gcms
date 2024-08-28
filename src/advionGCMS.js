/* reader.toString() provides the following information
    DIMENSIONS
      point_number                   = size: 0
      scan_number                    = size: 60
      error_number                   = size: 1
      _64_byte_string                = size: 64

    GLOBAL ATTRIBUTES
      dataset_completeness           = C1
      ms_template_revision           = 1.0.1
      netcdf_revision                = 4.2
      languages                      = English
      administrative_comments        =
      netcdf_file_date_time_stamp    = 202003031432433600000
      experiment_date_time_stamp     = 202003031432433600000
      source_file_reference          = JC-012_cleavage test_Scan1_is1.datx 2020.03.03 14:32:43
      source_file_format             = Advion ExpressIon Compact Mass Spectrometer Data System
      source_file_date_time_stamp    = 202003031432433600000
      experiment_title               =
      experiment_type                = Continuum Mass Spectrum
      test_ionization_mode           = Electrospray Ionization
      test_ionization_polarity       = Positive Polarity
      sample_state                   = Other State
      test_separation_type           = No Chromatography
      test_ms_inlet                  = Direct Inlet Probe
      test_detector_type             = Electron Multiplier
      test_resolution_type           = Constant Resolution
      test_scan_function             = Mass Scan
      test_scan_direction            = Up
      test_scan_law                  = Linear
      raw_data_mass_format           = Float
      raw_data_time_format           = Double
      raw_data_intensity_format      = Float
      units                          = Seconds
      global_mass_min                = 9.949999809265137
      global_mass_max                = 1199.75
      actual_run_time_length         = 133.46099853515625
      starting_scan_number           = 1
      actual_delay_time              = 0
      raw_data_uniform_sampling_flag = 0

    VARIABLES:
      error_log                      = ["","","","","","","","","","","","","","","",""," (length: 64)
      scan_index                     = [0,3096,6282,9865,13409,16765,20281,23603,27099,30 (length: 60)
      point_count                    = [3096,3186,3583,3544,3356,3516,3322,3496,3351,3031 (length: 60)
      flag_count                     = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 (length: 60)
      actual_scan_number             = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19 (length: 60)
      a_d_coaddition_factor          = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      a_d_sampling_rate              = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      inter_scan_time                = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      mass_range_min                 = [9.949999809265137,9.949999809265137,9.94999980926 (length: 60)
      mass_range_max                 = [164.6999969482422,169.1999969482422,189.050003051 (length: 60)
      scan_acquisition_time          = [0.08100000023841858,2.3420000076293945,4.60300016 (length: 60)
      scan_duration                  = [2.261000007390976,2.261000156402588,2.25999975204 (length: 60)
      resolution                     = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      time_range_min                 = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      time_range_max                 = [-9999,-9999,-9999,-9999,-9999,-9999,-9999,-9999,- (length: 60)
      total_intensity                = [4498210816,4468554240,5001547264,5405233152,50000 (length: 60)
      mass_values                    = [9.949999809265137,83.5,83.55000305175781,83.59999 (length: 199393)
      intensity_values               = [0,818716,462148,0,735558,952901,0,165241,421829,0 (length: 199393)
*/

export function advionGCMS(reader) {
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
