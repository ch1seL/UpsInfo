function dateChanged(el, val) {
    el.setAttribute('value', val);

    a = document.getElementById('dateForm');
    startDate = document.getElementById('dateStart').getAttribute('value');
    endDate = document.getElementById('dateEnd').getAttribute('value');


    startDate = new Date(startDate);
    startDate = +startDate + (new Date().getTimezoneOffset() * 60 * 1000);

    endDate = new Date(endDate);
    endDate = +endDate + (new Date().getTimezoneOffset() * 60 * 1000);
    console.log(startDate, endDate, a);
    a.setAttribute('href', '/' + startDate + '-' + endDate);
}