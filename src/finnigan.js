'use strict';

function finnigan(reader) {
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
        series: [{
            name: 'tic',
            dimension: 1,
            data: tic
        }, {
            name: 'ms',
            dimension: 2,
            data: ms
        }]
    };
}

module.exports = finnigan;
