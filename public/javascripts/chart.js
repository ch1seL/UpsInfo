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

    var chartDiv = document.getElementById('chart_div');
    var chart = new google.visualization.LineChart(chartDiv);

    getHistory(function (res) {
        arr = [['Дата', 'Температура', 'Влажность']].
            concat(res.map((item) => [item[0], item[1], item[2]]));

        var data = google.visualization.arrayToDataTable(
            arr
        );

        var classicOptions = {
            title: 'Микроклимат в серверной',
            curveType: 'function',
            width: 1000,
            height: 500,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { targetAxisIndex: 0 },
                1: { targetAxisIndex: 1 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Температура', viewWindow: { min:20 , max: 22 } },
                1: { title: 'Влажность', viewWindow: {  } }
            }
        }

        chart.draw(data, classicOptions);
    });
}