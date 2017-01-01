google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function getHistory(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', '/gethistory');
    request.onreadystatechange = function (e) {
        if (this.readyState == 4) {
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                callback(response);
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

        arr = [['Дата', 'Температура', 'Влажность']].
            concat(res.map((item) => [new Date(item.date).toLocaleTimeString(), item.epm_temperature, item.epm_humidity]));

        console.log(arr);

        var data = google.visualization.arrayToDataTable(
            arr
        );



        var options = {
            title: 'Микроклимат в серверной',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    });
}