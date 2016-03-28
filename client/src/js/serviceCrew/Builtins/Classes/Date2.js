class Date2 {
  constructor(_date) {
    if (_date !== undefined)
      this.date = new Date(_date);
    else
      this.date = new Date();
  }

  getDateAtDayNextWeek(_dayNumber) {
    let todayNumber = this.date.getDay();
    let remainUntilNextSun = 7 - todayNumber;
    let remainDayNextWeak = remainUntilNextSun + _dayNumber;

    return new Date(this.date.getTime() + (1000 * 60 * 60 * 24) * remainDayNextWeak);
  }
}

export default Date2;