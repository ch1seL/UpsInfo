function dateChanged(el, val, timezoneOffset) {
    el.setAttribute('value', val);

    var a = document.getElementById('dateForm');
    var startDate = document.getElementById('dateStart').getAttribute('value');
    var endDate = document.getElementById('dateEnd').getAttribute('value');

    startDate = getDateWithOrWithoutOffset((new Date(startDate)).getTime(), true);
    endDate = getDateWithOrWithoutOffset((new Date(endDate)).getTime(), true);

    a.setAttribute('href', '/' + startDate + '-' + endDate);
}

function getDateWithOrWithoutOffset(dateUtc, without = false) {
    var timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
    if (!without) timezoneOffset = -timezoneOffset;
    return +dateUtc + timezoneOffset;
}

function getISODateWithOrWithoutOffset(dateUtc, without = false) {
    var dateWithOffset = new Date();
    dateWithOffset.setTime(getDateWithOrWithoutOffset(+dateUtc, without));
    return dateWithOffset.toISOString().substring(0, 16);
}

function start() {
    var parameters = document.getElementById('parameters');

    start = end = "undefined";
    if (parameters != null) {
        start = parameters.getAttribute("start");
        end = parameters.getAttribute("end");
    }

    document.getElementById('dateStart').setAttribute('value', getISODateWithOrWithoutOffset(start));
    document.getElementById('dateEnd').setAttribute('value', getISODateWithOrWithoutOffset(end));
}

window.onload = function() {
    start();
}