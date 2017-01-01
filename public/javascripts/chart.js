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
                    map((item) => [item.date, item.epm_temperature, item.epm_humidity]).sort((a, b) => {
                        a = new Date(a[0]).getTime();
                        b = new Date(b[0]).getTime();
                        return (a - b < 0 ? -1 : a - b > 0 ? 1 : 0);
                    }).
                    map((item) => {
                        date = new Date(item[0]);
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

        var materialOptions = {
            chart: {
                title: 'Микроклимат в серверной',
                curveType: 'function'
            },

            width: 900,
            height: 500,
            series: {
                // Gives each series an axis name that matches the Y-axis below.                
                0: { lineWidth: 100, axis: 'Температура' },
                1: { axis: 'Влажность' }
            },
            axes: {
                // Adds labels to each axis; they don't have to match the axis names.
                y: {

                    Temps: { label: 'Temps (Celsius)' },
                    Daylight: { label: 'Daylight' }
                }
            },
            vAxis: { minValue: 0 }

        };


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
                0: { title: 'Температура', viewWindow: { min: 16 } },
                1: { title: 'Влажность' , viewWindow: { min: 20 } }
            }
        }
        /*
        var classicOptions = {
            title: 'Микроклимат в серверной',
            curveType: 'function',
            width: 1200,
            height: 500,
            // Gives each series an axis that matches the vAxes number below.
            series: {
                0: { targetAxisIndex: 0 },
                1: { targetAxisIndex: 1 }
            },
            vAxes: {
                // Adds titles to each axis.
                0: { title: 'Температура2' },
                1: { title: 'Влажность' }
            },
            vAxis: {
                viewWindow: {
                    max: 20
                }
            }
        };*/

        chart.draw(data, classicOptions);
    });
}