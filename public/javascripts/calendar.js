// Note that FullCalendar expects a certain format for events (tasks)
// Additional fields (e.g. description) can be added if desired
// See: https://fullcalendar.io/docs/event_data/Event_Source_Object/
// TODO: Populate the tasks object with real data from db
$("#h1").hide();
var tasks = {
  events: [{
      title: "This is a claimed task",
      start: "2017-08-01T12:00:00",
      claimed: true,
      description: "This is a longer description of the task.",
      backgroundColor: "green",
      borderColor: "green"
    },
    {
      title: "This is another claimed task",
      start: "2017-08-01T14:00:00",
      claimed: true,
      description: "This is a longer description of the task.",
      backgroundColor: "green",
      borderColor: "green"
    },
    {
      title: "An unclaimed task here",
      start: "2017-08-17T10:00:00",
      claimed: false,
      description: "This is a longer description of the second task.",
      backgroundColor: "red",
      borderColor: "red"
    }
  ],
  className: "task" // adds class to all events
};

function addNewTask(data) {
  // TODO: Trigger a modal for inputing a new task
  console.log("The date that was clicked: " + $(data).data().date);
}

function showTask(task) {
  // TODO: Trigger a modal for showing task details
  $("#taskDetails .modalContent").html("<h2>" + task.title + "</h2>");
  $("#taskDetails .modalContent").append("<p>" + task.description + "</p>");
  if (task.claimed) {
    $("#taskDetails .modalContent").append("<p>This task has been claimed by XXX</p>");
  } else {
    $("#taskDetails .modalContent").append("<p>This has <strong>not</strong> been claimed.</p>");
    $("#taskDetails .modalContent").append("<button type='button'>Claim it!</button>");
  }
  $("#taskDetails").show();
  $("#taskDetails").animate({
    "opacity": 100,
  }, "fast");
  console.log(task.title);
  console.log(task.description);
  console.log("Task claimed? " + task.claimed);
}

$(document).ready(function() {
  // Note, we should call fullCalendar() *after* we get data back from server,
  // i.e. as a callback on our forthcoming $.get()
  $("#calendar").fullCalendar({
    // OPTIONS
    events: tasks,
    header: {
      left: 'title',
      center: 'basicDay,basicWeek,month',
      right: 'today prev,next'
    },
    // CALLBACK EVENTS
    // After calendar is rendered, before other events are triggered
    viewRender: function() {
      console.log("Calendar rendered");
    },
    // When an event is clicked
    eventClick: function(task) {
      showTask(task);
    },
    // When a day is clicked
    dayClick: function(day) {
      addNewTask(day);
    }
  }); // fullCalendar

  // Sidebar
  var sidebarOpen = true;
  $("#sidebarToggle").click(function() {
    if (sidebarOpen) {
      $("#sidebar").animate({
        left: '-23%'
      });
      $("#calendar").animate({
        width: '97%'
      });
      sidebarOpen = false;
      $("#sidebarToggle").html("show");
    } else {
      $("#sidebar").animate({
        left: '0%'
      });
      $("#calendar").animate({
        width: '75%'
      });
      $("#sidebarToggle").html("hide");
      sidebarOpen = true;
    }
  });

  // Modals
  $(".modal .close").on("click", document, function() {
    // When close button is clicked, animate opacity to 0
    $(".modal").animate({
        "opacity": 0
      },
      // animation speed
      "fast",
      // animation complete callback
      function() {
        console.log("Animation complete");
        $(".modal").css("display", "none");
      });
  });


  $("#addtask").on("click", document, function() {

    $("#taskDetails").show();

    $("#taskDetails .modalContent").html('\
            <form>Task Name:<br><input type="text" id="taskName">\
            <br>Task Date and Time:<br><input type="datetime-local"  id="taskDate">\
            <br>Task Description:<br><textarea class="form-control" rows="3" id="taskDescription"></textarea>\
            <br><br><input type="submit" value="Submit" id="submit">\
            </form>');
    $("#submit").on("click", document, function(event) {
      event.preventDefault();

      var newTask = {};
      newTask.taskName = $("#taskName").val().trim();
      newTask.taskDate = $("#taskDate").val().trim();
      newTask.taskDescription = $("#taskDescription").val().trim();
      // This is fake data for now, will eventually come from session variable
      newTask.taskRequester = 5;
      newTask.taskCalendar = 1;
      newTask.taskAccepted = false;

      $.ajax({
          url: '/task/new',
          method: "POST",
          data: newTask,
          xhrFields: {
            withCredentials: true
          }
        })
        .done(function(response) {
          console.log(response);
          // callback
          $(".modal").animate({
              "opacity": 0
            }, "fast",
            // animation complete callback
            function() {
              console.log("Animation complete");
              $(".modal").css("display", "none");
            });
        });

    });



  });


});
