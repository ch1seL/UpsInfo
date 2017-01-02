google.charts.load('current', { 'packages': ['line', 'corechart'] });
google.charts.setOnLoadCallback(drawChart);

function getHistory(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/gethistory');
    request.onreadystatechange = function (e) {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                res = response.
                    map((item) => [item.date, item.epm_temperature, item.epm_humidity]).sort(1 - 1).
                    map((item) => {
                        date = new Date()
                        date.setTime(item[0]);
                        return [date.toLocaleTimeString(), item[1], item[2]];
                    });

                callback(res);
            }
            else {
                // тут сообщаем о сетевой ошибке
            }
        }
    }
    request.send(null);
}

function drawChart() {
    getHistory(function (res) {
        chartDivTemp = document.getElementById('chart_div_temp');
        chartTemp = new google.visualization.LineChart(chartDivTemp);
        dataTemp = google.visualization.arrayToDataTable([['Дата', 'Температура']].concat(res.map((item) => [item[0], item[1]])));
        classicOptionsTemp = {
            title: 'Температура в серверной',
            curveType: 'function',
            width: 1000,
            height: 400,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { targetAxisIndex: 0 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Температура', viewWindow: {} }
            }
        }
        chartTemp.draw(dataTemp, classicOptionsTemp);

        chartDivHum = document.getElementById('chart_div_hum');
        chartHum = new google.visualization.LineChart(chartDivHum);
        dataHum = google.visualization.arrayToDataTable([['Дата', 'Влажность']].concat(res.map((item) => [item[0], item[2]])));
        classicOptionsHum = {
            title: 'Влажность в серверной',
            curveType: 'function',
            width: 1000,
            height: 400,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { color: 'red', targetAxisIndex: 0 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Влажность', viewWindow: {} }
            }
        }
        chartHum.draw(dataHum, classicOptionsHum);
    });
}