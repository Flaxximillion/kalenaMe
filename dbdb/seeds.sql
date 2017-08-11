INSERT INTO globalUsers (globalUserUUID, globalUserFirstName, globalUserLastName, globalUserPhone, globalUserEmail, globalUserPassword)
VALUES
  (
    "12345",
    "Ace",
    "Ventura",
    "305-555-5555",
    "ace.ventura@gmail.com",
    "NewEnglandClamChowder"
  ),
  (
    "67890",
    "Lois",
    "Einhorn",
    "911",
    "FinkleIsEinhorn@gmail.com",
    "LacesWereOut"
  );

INSERT INTO calendarUsers (calendarUserUUID, calendarUserFirstName, calendarUserLastName, calendarUserPhone, calendarUserEmail)
VALUES
  (
    "12345",
    "Ace",
    "Ventura",
    "305-555-5555",
    "ace.ventura@gmail.com"
  ),
  (
    "67890",
    "Lois",
    "Einhorn",
    "911",
    "FinkleIsEinhorn@gmail.com"
  );

INSERT INTO Tasks (taskCalendar, taskName, taskDescription, taskRequester, taskDate, taskTime)
VALUES
  (
    "calNo1",
    "Find Snowflake",
    "I need help finding the Miami Dolphins mascot, Snowflake.",
    "12345",
    "2017-08-20",
    "13:00:00"
  );

INSERT INTO Messages (messageCalendar, messageSender, messageReceiver, messageBody, createdAt, updatedAt)
VALUES
  (
    "calNo1",
    "67890",
    "12345",
    "Alright, Ventura. Make it quick.",
    "2017-08-10 11:00:00",
    "2017-08-10 11:00:00"
  ),
  (
    "calNo1",
    "12345",
    "67890",
    "I found a rare stone at the bottom of Snowflake's tank. It belonged to a 1984 AFC Championship ring. It would have been a Super Bowl ring, but Ray Finkle missed the big kick. Blames the whole thing on Marino. We're talking mental institute escapee. I saw the guy's room. Cozy if you're Hannibal Lecter!",
    "2017-08-10 11:01:00",
    "2017-08-10 11:01:00"
  );

INSERT INTO Calendars (calendarID, calendarName, calendarDescription)
VALUES
  (
    "calNo1",
    "Maimi Missing Pets",
    "Lost or missing pets in and around the greater Miami area"
  );
