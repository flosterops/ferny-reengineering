class DateUtility {
  static numberToMonth(number: number): string {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[number];
  }

  static epochToDate(time: number): string {
    const date = new Date(0);
    date.setUTCSeconds(time);
    return `${date.getDate()} ${DateUtility.numberToMonth(
      date.getMonth()
    )} ${date.getFullYear()}`;
  }
}

export { DateUtility };
module.exports = DateUtility;
