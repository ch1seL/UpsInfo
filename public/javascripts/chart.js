google.charts.load('current', { 'packages': ['line', 'corechart'] });
google.charts.setOnLoadCallback(drawChart);

var dateFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
};

function getHistory(callback) {
    var parameters = document.getElementById('parameters');

    start = end = "undefined";
    if (parameters != null) {
        start = parameters.getAttribute("start");
        end = parameters.getAttribute("end");
    }

    var urlParams = (start != "undefined" && end != "undefined") ? start + '-' + end : "";

    var request = new XMLHttpRequest();
    request.open('GET', '/gethistory/' + urlParams);
    request.onreadystatechange = function(e) {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                res = response.
                filter((item) => {
                    return item.date != undefined && item.epm_temperature != undefined && item.epm_humidity != undefined
                }).
                map((item) => {
                    date = new Date(item.date)
                    return [date.toLocaleString("ru", dateFormatOptions),
                        item.epm_temperature, item.epm_humidity,
                        item.epm_temperature_max, item.epm_temperature_min,
                        item.epm_humidity_max, item.epm_humidity_min
                    ];
                });

                callback(res);
            } else {
                console.log('Сетевая ошибка!');
                callback(null);
            }
        }
    }
    request.send(null);
}

function drawChart() {
    getHistory(function(res) {

        if (res == null) return;

        var lastRes = res[res.length - 1];
        var chartDivTemp = document.getElementById('chart_div_temp');
        var chartTemp = new google.visualization.LineChart(chartDivTemp);
        var dataTemp = google.visualization.arrayToDataTable([
            ['Дата', 'Средняя', 'Макс', 'Мин']
        ].concat(res.map((item) => [item[0], +item[1].toFixed(1), +item[3].toFixed(1), +item[4].toFixed(1)])));
        var classicOptionsTemp = {
            title: 'Температура в серверной ' + lastRes[1].toFixed(1) || "",
            curveType: 'function',
            width: 1000,
            height: 400,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { targetAxisIndex: 0 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Средняя', viewWindow: {} },
                1: { title: 'Макс', viewWindow: {} },
                2: { title: 'Мин', viewWindow: {} }
            }
        }
        chartTemp.draw(dataTemp, classicOptionsTemp);

        chartDivHum = document.getElementById('chart_div_hum');
        chartHum = new google.visualization.LineChart(chartDivHum);
        dataHum = google.visualization.arrayToDataTable([
            ['Дата', 'Средняя', 'Макс', 'Мин']
        ].concat(res.map((item) => [item[0], +item[2].toFixed(0), +item[5].toFixed(0), +item[6].toFixed(0)])));
        classicOptionsHum = {
            title: 'Влажность в серверной ' + lastRes[2].toFixed(0) || "",
            curveType: 'function',
            width: 1000,
            height: 400,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { color: 'red', targetAxisIndex: 0 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Средняя', viewWindow: {} },
                1: { title: 'Макс', viewWindow: {} },
                2: { title: 'Мин', viewWindow: {} }
            }
        }
        chartHum.draw(dataHum, classicOptionsHum);
    });
}