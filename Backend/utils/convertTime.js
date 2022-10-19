module.exports={
      convertTime: function(unixTime){
        console.log("unix: "+unixTime);
          var date = new Date(unixTime)
          var month = date.getMonth()+1

          var formattedDate = date.getFullYear()+"-"

          if(month > 9){
              formattedDate += month+"-"
          }
          else{
            formattedDate += "0"+month+"-"
          }
          if(date.getDate() > 9){
            formattedDate += date.getDate()
          }
          else{
            formattedDate += "0"+date.getDate()
          }
          console.log("date: "+date)
          console.log("res: "+formattedDate);
          return formattedDate
      }
}