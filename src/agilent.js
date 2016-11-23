'use strict';

function agilent(reader) {
    const time = reader.getDataVariable('scan_acquisition_time');
    const tic = reader.getDataVariable('total_intensity');

    // variables to get the mass-intensity values
    const pointCount = reader.getDataVariable('point_count');
    const massValues = reader.getDataVariable('mass_values');
    const intensityValues = reader.getDataVariable('intensity_values');

    var ms = new Array(pointCount.length);
    var index = 0;
    for (var i = 0; i < ms.length; i++) {
        var size = pointCount[i];
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

module.exports = agilent;
