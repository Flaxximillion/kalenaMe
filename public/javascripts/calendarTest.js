$(document).ready(function(){

  //function for listing all of the calendars
  function getCalendars(){
    $.get("/aip/calendar", function(data){
      var calTable = $("<table>");
      var row1 = $("<tr>");
      var calName = $("<th>Calendar Name</th>");
      var calDesc = $("<th>Calendar Description</th>");
      $(row1).append(calName);
      $(row1).append(calDesc);
      $(calTable).append(row1);

      for (var i = 0; i < data.length; i++) {
        var row = $("<tr>");
        var name = $("<td>" + data[i].calendarName + "</td>");
        var desc = $("<td>" + data[i].calendarDescription + "</td>");
        $(row).append(name);
        $(row).append(desc);
        $(calTable).append(row);
      }
      $("#calendarList").append(calTable);
    });
  }

  //function for creating new calendar. calles getCalendars upon completion
  function createCalendar(calData){
    $.post("/api/calendar", caldata).then(getCalendars);
  }

  getCalendars();
});
