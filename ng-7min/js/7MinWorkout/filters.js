// FILTERS
angular.module('7minWorkout').filter('secondsToTime', function () {
    return function (input) {
        var sec = parseInt(input, 10); // ukupno u sekundama
        if (isNaN(sec)) return '00:00:00';

        var hours = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - (hours * 3600)) / 60);
        var seconds = sec - (hours * 3600) - (minutes * 60);

        // 00:02:35 = 00h 02min 35s
        return ("0" + hours).substr(-2) + ':'
                + ("0" + minutes).substr(-2) + ':'
                + ("0" + seconds).substr(-2);
    };
});
