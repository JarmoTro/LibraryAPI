module.exports = {
  convertTime: function (unixTime) {
    var date = new Date(unixTime);
    var month = date.getMonth() + 1;

    var formattedDate = date.getFullYear() + "-";

    if (month > 9) {
      formattedDate += month + "-";
    } else {
      formattedDate += "0" + month + "-";
    }
    if (date.getDate() > 9) {
      formattedDate += date.getDate();
    } else {
      formattedDate += "0" + date.getDate();
    }
    return formattedDate;
  },
};
