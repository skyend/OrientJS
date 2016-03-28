import Shortcut from '../../DataResolver/Shortcut';

class DateDistance {

  // 받을 수 있는 포맷
  // timestamp(number, string) , DateObject, Date string
  constructor(_from, _to) {

    this.fromStamp = DateDistance.toTimestamp(_from);
    this.toStamp = DateDistance.toTimestamp(_to);


    this.deviation = this.toStamp - this.fromStamp;


    this.seconds = this.deviation / 1000;
    this.mins = this.seconds / 60;
    this.hours = this.mins / 60;
    this.dates = this.hours / 24;
    this.months = this.dates / 30;
    this.years = this.months / 365;
  }

  byHours(_abs) {
    return _abs ? Math.abs(this.hours) : this.hours;
  }

  byDates(_abs) {
    return _abs ? Math.abs(this.dates) : this.dates;
  }

  byMonths(_abs) {
    return _abs ? Math.abs(this.months) : this.months;
  }

  byYears(_abs) {
    return _abs ? Math.abs(this.years) : this.years;
  }

  static toTimestamp(_dateMean) {
    if (typeof _dateMean === 'string') {
      if (/^\d+$/.test(_dateMean)) {
        return parseInt(_dateMean);
      } else {
        return (new Date(Shortcut.reviseDateString(_dateMean))).getTime();
      }
    } else if (typeof _dateMean === 'number') {
      return _dateMean;
    } else if (typeof _dateMean === 'object') {
      if (_dateMean !== null && _dateMean !== undefined)
        return _dateMean.getTime();
    }
  }
}

export default DateDistance;