module.exports={
      convertTime: function(unixTime){
          var date = new Date(unixTime)
          var month = date.getMonth()+1
          var formattedDate = date.getDate()+"."+month+"."+date.getFullYear()
          return formattedDate
      }
}