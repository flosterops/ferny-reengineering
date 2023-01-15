class TimeUtility {
  static epochToTime(time: number): string {
    const date = new Date(0);
    date.setUTCSeconds(time);

    let minutes = date.getMinutes();
    let hours = date.getHours();

    if (minutes <= 9) {
      //@ts-ignore
      minutes = "0" + minutes;
    }

    if (hours <= 9) {
      //@ts-ignore
      hours = "0" + hours;
    }

    return hours + ":" + minutes;
  }
}

export { TimeUtility };
module.exports = TimeUtility;
