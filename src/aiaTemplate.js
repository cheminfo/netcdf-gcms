'use strict';

function aiaTemplate(reader) {
    var time = [];
    const tic = reader.getDataVariable('ordinate_values');

    // variables to get the time
    const delayTime = Number(reader.getDataVariable('actual_delay_time'));
    const interval = Number(reader.getDataVariable('actual_sampling_interval'));

    var currentTime = delayTime;
    for (var i = 0; i < tic.length; i++) {
        time.push(currentTime);
        currentTime += interval;
    }

    return {
        times: time,
        series: [{
            name: 'tic',
            dimension: 1,
            data: tic
        }]
    };
}

module.exports = aiaTemplate;
