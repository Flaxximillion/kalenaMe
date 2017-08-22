// Note that FullCalendar expects a certain format for events (tasks)
// Additional fields (e.g. description) can be added if desired
// See: https://fullcalendar.io/docs/event_data/Event_Source_Object/

function addNewTask() {
    $(".modal").show();
    $(".modal").animate({
        "opacity": 100
    }, "fast");

    $(".modal .modalContent").html('\
          <form><div id="taskNameLabel">Task Name (required):</div><input type="text" id="taskName" required><br>\
          <div id="taskDateLabel">Task Date and Time (required):</div><input type="text" id="taskDate" required><br>\
          <div id="taskDescriptionLabel">Task Description:</div><textarea class="form-control" rows="3" id="taskDescription"></textarea><br><br>\
          <input type="submit" value="Submit" id="submit">\
          </form>');

    // See: https://chmln.github.io/flatpickr/getting-started/
    $("#taskDate").flatpickr({
        enableTime: true
    });

    $(".modal #submit").on("click", document, function (event) {
        event.preventDefault();

        var newTask = {};

        if ($("#taskName").val().trim() != "") {
            $("#taskNameLabel").css("color", "black");
            newTask.taskName = $("#taskName").val().trim();
        } else {
            $("#taskNameLabel").css("color", "red");
            return;
        }

        if ($("#taskDate").val().trim() != "") {
            $("#taskDateLabel").css("color", "black");
            newTask.taskDate = $("#taskDate").val().trim();
        } else {
            $("#taskDateLabel").css("color", "red");
            return;
        }

        newTask.taskDescription = $("#taskDescription").val().trim();

        // Coming from calendar.hbs
        newTask.taskCalendar = $('body').attr('id');
        // It's a new task, no one has accepted it yet
        newTask.taskAccepted = false;


        $.ajax({
            url: '/task/new',
            method: "POST",
            data: newTask,
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function (response) {
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
        }, "fast", function () {
            console.log("Animation complete");
            $(".modal").hide();
        });
    }
}

function fetchTasks() {
    $.get("/task/" + $('body').attr('id'))
        .done(function (tasks) {
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
                viewRender: function () {
                  $(document).ready(function() {
                    $( "button" ).removeClass( "fc-button fc-state-default");
                    $( "button" ).removeClass( "fc-button fc-state-default");

                  });
                    console.log("Calendar rendered");
                },
                // When an event is clicked
                eventClick: function (task) {
                    showTask(task);
                },
                // When a day is clicked
                dayClick: function (day) {
                    addNewTask(day);
                }
            }); // fullCalendar
        });
}

// function fetchUsers() {
//   $.get("/")
//   .then(function () {
//     // do stuff
//     also, i should get calendar ID from this ajax call that I can use
//    in the addTask() function
//   });
// }


function showTask(task) {
    // TODO: Trigger a modal for showing task details
    $(".modal .modalContent").html("<h2>" + task.title + "</h2>");
    $(".modal .modalContent").append("<p>" + task.description + "</p>");
    $(".modal .modalContent").append("<p>Created by: " + task.taskCreator + "</p>");
    if (task.claimed) {
        $(".modal .claimStatus").html("<p>This task has been claimed by " + task.claimUser + "</p>");
    } else {
        $(".modal .claimStatus").html("<p>This has <strong>not</strong> been claimed.</p>");
        $(".modal .claimStatus").append("<button class='claim' data-id='" + task.id + "' type='button'>Claim it!</button>");
    }
    $(".modal").show();
    $(".modal").animate({
        "opacity": 100
    }, "fast");
}

$(document).ready(function () {

    $("#inviteUser").click(function(event){
        $(".invite").toggle();
    });

    $("#sendInvite").click(function(event){
       if($("#inviteEmail").val()!==""){
           var inviteData = {
               calendarID: $("body").attr('id'),
               email: $("#inviteEmail").val().trim()
           };
           $.post("/calendar/invite/" + $("body").attr('id'), inviteData, function (response) {
               console.log(response);
               $(".invite").toggle();
           });
       }
    });

    $("#h1").hide();

    fetchTasks();

    // Sidebar
    var sidebarOpen = true;
    $("#sidebarToggle").click(function () {
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
    $(".modal .close").on("click", document, function () {
        closeModal();
    });



    $("#gotomessages").on("click", function(){
      $.get("/calendar/api/" + $("body").attr("id"), function(response){
        console.log("heading over to messages");
      });
    });

    $(document).on("click", "button.claim", function (elem) {
        var taskID = $(elem.target).data("id");
        // console.log("taskID: "+taskID);
        var updateData = {
            taskAccepted: 1
            // Hard-coded, eventually will be from session data of logged in user
            //taskAccepter: 5
        };
        $.post("/task/update/" + taskID, updateData, function (response) {
            console.log(response);
            closeModal(true);
        });
    });

    $("#addtask").on("click", document, function () {
        addNewTask();
    });

});
