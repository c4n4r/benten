import I_DateHelper from '../../application/dates/date.helper';

export default class DateHelper extends I_DateHelper {
  now(): Date {
    return new Date();
  }
}
