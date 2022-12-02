

/* reader.toString() provides the following information
    GLOBAL ATTRIBUTES
      dataset_completeness           = C1+C2
      aia_template_revision          = 1.0
      netcdf_revision                = 2.3
      languages                      = English only
      injection_date_time_stamp      = 20181030174305+0000
      HP_injection_time              = 30-Oct-18, 17:43:05
      experiment_title               = SequenceLine: 1  Inj: 1
      operator_name                  = SYSTEM
      separation_experiment_type     = liquid chromatography
      source_file_reference          = C:\CHEM32\1\DATA\MINGMING\MW-1-MEO-I IC-90 2018-10-30 17-42-13\MW-2-6-6 IC 90.D
      sample_name                    = MW-2-6-6 IC 90
      sample_id                      =
      detector_unit                  = mAU
      detection_method_name          = POS 3 IC 90-10 31 MIN.M
      detector_name                  = DAD1 A, Sig=254,4 Ref=360,100
      retention_unit                 = seconds

   VARIABLES:
      detector_maximum_value         = [130.9263458251953] (length: 1)
      detector_minimum_value         = [-0.1758841574192047] (length: 1)
      actual_run_time_length         = [1860] (length: 1)
      actual_delay_time              = [0.012000000104308128] (length: 1)
      actual_sampling_interval       = [0.4000000059604645] (length: 1)
      ordinate_values                = [-0.07588416337966919,-0.07525086402893066,-0.0740 (length: 4651)
      peak_retention_time            = [196.0651397705078,332.5663757324219,527.549865722 (length: 8)
      peak_start_time                = [186.81199645996094,239.21200561523438,502.4119873 (length: 8)
      peak_end_time                  = [220.81201171875,471.5176696777344,572.47869873046 (length: 8)
      peak_width                     = [4.974428176879883,62.90694808959961,11.9328641891 (length: 8)
      peak_area                      = [556.7650146484375,419.825439453125,66.56610107421 (length: 8)
      peak_area_percent              = [7.0321502685546875,5.302552223205566,0.8407546877 (length: 8)
      peak_height                    = [100.07515716552734,5.1860527992248535,4.827196121 (length: 8)
      peak_height_percent            = [29.76352310180664,1.5423927307128906,1.4356645345 (length: 8)
      peak_asymmetry                 = [1.4555920362472534,0.8351489901542664,1.707817316 (length: 8)
      baseline_start_time            = [186.81199645996094,239.21200561523438,502.4119873 (length: 8)
      baseline_start_value           = [1.9561424255371094,0.9857341647148132,1.127734780 (length: 8)
      baseline_stop_time             = [220.81201171875,471.5176696777344,572.47869873046 (length: 8)
      baseline_stop_value            = [1.1907591819763184,1.10896897315979,1.18347382545 (length: 8)
      peak_start_detection_code      = ["B","","B","","B","","B","","V","","B","","B","", (length: 16)
      peak_stop_detection_code       = ["B","","B","","B","","V","","B","","B","","B","", (length: 16)
      migration_time                 = [196.0651397705078,332.5663757324219,527.549865722 (length: 8)
      peak_area_square_root          = [23.595869064331055,20.489643096923828,8.158804893 (length: 8)
      manually_reintegrated_peaks    = [0,0,0,0,0,0,0,0] (length: 8)
*/

function agilentHPLC(reader) {
  const intensities = reader.getDataVariable('ordinate_values');
  const numberPoints = intensities.length;
  const detector = reader.getAttribute('detector_name');
  let channel;
  if (detector.match(/dad/i)) {
    channel = `uv${Number(detector.replace(/.*Sig=([0-9]+).*/, '$1'))}`;
  } else if (detector.match(/tic/i)) {
    channel = 'tic';
  } else {
    channel = 'unknown';
  }
  const delayTime = reader.getDataVariable('actual_delay_time')[0];
  const runtimeLength = reader.getDataVariable('actual_run_time_length')[0];
  let samplingInterval;
  if (reader.dataVariableExists('actual_sampling_interval')) {
    samplingInterval = reader.getDataVariable('actual_sampling_interval')[0];

    if (
      Math.abs(delayTime + samplingInterval * numberPoints - runtimeLength) > 3
    ) {
      throw new Error(
        'The expected last time does not correspond to the runtimeLength',
      );
    }
  } else {
    samplingInterval = (runtimeLength - delayTime) / numberPoints;
  }

  let times = [];
  let time = delayTime;
  for (let i = 0; i < numberPoints; i++) {
    times.push(time);
    time += samplingInterval;
  }

  return {
    times,
    series: [
      {
        name: channel,
        dimension: 1,
        data: intensities,
      },
    ],
  };
}

module.exports = agilentHPLC;
