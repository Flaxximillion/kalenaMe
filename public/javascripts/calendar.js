// Note that FullCalendar expects a certain format for events (tasks)
// Additional fields (e.g. description) can be added if desired
// See: https://fullcalendar.io/docs/event_data/Event_Source_Object/

function addNewTask() {
  $(".modal").show();
  $(".modal").animate({
    "opacity": 100
  }, "fast");

  $(".modal .modalContent").html('\
          <form>Task Name:<br><input type="text" id="taskName"><br>\
          Task Date and Time:<br><input type="datetime-local"  id="taskDate"><br>\
          Task Description:<br><textarea class="form-control" rows="3" id="taskDescription"></textarea><br><br>\
          <input type="submit" value="Submit" id="submit">\
          </form>');
  $(".modal #submit").on("click", document, function(event) {
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
        closeModal(true);
      });
  });
}

function closeModal(reloadPage) {
  // When close button is clicked, animate opacity to 0
  if (reloadPage) {
    location.reload(true);
  } else {
    $(".modal").animate({
      "opacity": 0
    }, "fast", function() {
      console.log("Animation complete");
      $(".modal").hide();
    });
  }
}

function fetchTasks() {
  $.get("/task")
    .done(function(tasks) {
      console.log("AJAX data received");
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
    });
}


function showTask(task) {
  // TODO: Trigger a modal for showing task details
  $(".modal .modalContent").html("<h2>" + task.title + "</h2>");
  $(".modal .modalContent").append("<p>" + task.description + "</p>");
  if (task.claimed) {
    $(".modal .claimStatus").html("<p>This task has been claimed by XXX</p>");
  } else {
    $(".modal .claimStatus").html("<p>This has <strong>not</strong> been claimed.</p>");
    $(".modal .claimStatus").append("<button class='claim' data-id='" + task.id + "' type='button'>Claim it!</button>");
  }
  $(".modal").show();
  $(".modal").animate({
    "opacity": 100,
  }, "fast");
}

$(document).ready(function() {

  $("#h1").hide();

  fetchTasks();

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
    closeModal();
  });

  $(document).on("click", "button.claim", function(elem) {
    var taskID = $(elem.target).data("id");
    // console.log("taskID: "+taskID);
    var updateData = {
      taskAccepted: 1,
      // Hard-coded, eventually will be from session data of logged in user
      taskAccepter: 5
    };
    $.post("/task/update/" + taskID, updateData, function(response) {
      console.log(response);
      closeModal(true);
    });
  });

  $("#addtask").on("click", document, function() {
    addNewTask();
  });
});
