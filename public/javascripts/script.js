function dateChanged(el, val, timezoneOffset) {
    el.setAttribute('value', val);

    a = document.getElementById('dateForm');
    startDate = document.getElementById('dateStart').getAttribute('value');
    endDate = document.getElementById('dateEnd').getAttribute('value');


    startDate = getDateWithOrWithoutOffset(+startDate, true);
    endDate = getDateWithOrWithoutOffset(+endDate, true);


    a.setAttribute('href', '/' + startDate + '-' + endDate);
}

function getDateWithOrWithoutOffset(dateUtc, without = false) {
    var timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
    if (!without) timezoneOffset = -timezoneOffset;
    return +dateUtc + timezoneOffset;
}

function getISODateWithOrWithoutOffset(dateUtc, without = false) {
    var timezoneOffset = (new Date()).getTimezoneOffset() * 60 * 1000;
    if (!without) timezoneOffset = -timezoneOffset;
    var dateWithOffset = new Date();
    dateWithOffset.setTime(+dateUtc + timezoneOffset);    
    return dateWithOffset.toISOString().substring(0, 16);
}

function setValue() {
    var parameters = document.getElementById('parameters');

    start = end = "undefined";
    if (parameters != null) {
        start = parameters.getAttribute("start");
        end = parameters.getAttribute("end");
    }

    document.getElementById('dateStart').setAttribute('value', getISODateWithOrWithoutOffset(start));
    document.getElementById('dateEnd').setAttribute('value', getISODateWithOrWithoutOffset(end));
}