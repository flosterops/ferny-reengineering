function numberToMonth(number) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[number];
}

function epochToDate(time) {
    const date = new Date(0);
    date.setUTCSeconds(time);
    const str = date.getDate() + " " + numberToMonth(date.getMonth()) + " " + date.getFullYear(); 
    return str;
}

export {}
module.exports = epochToDate;
