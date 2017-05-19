/**
 * Created by John on 2017-02-14 .
 */
import moment from 'moment';

moment.locale('zh-cn');

moment.locale('zh-cn', {
  weekdays : [
    "周日", "周一", "周二", "周三", "周四", "周五", "周六"
  ]
});

let common = {};

// 格式化时间
common.formatDate = (date, formatStr) => {
  if (!date) {
    return moment().toDate();
  }
  if (formatStr == null) {
    return moment(date).toDate();
  }
  return moment(date).format(formatStr);
};

common.timeDifference = (from, to) => {
  return from.getTime() - to.getTime();
}

common.formatDay = (date) => {
  return moment(date).format('dddd');
}

export default common;
