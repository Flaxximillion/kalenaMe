var expect = require('chai').expect;

describe("Calendar Functions", function(){
    before(function(){
        return require("../models").sequelize.sync();
    });

    beforeEach(function(){
        this.Calendar = require("../models").calendar;
    });
    describe("Calendar Generation", function(){
        it("creates a new calendar based on user input", function(){
            return this.Calendar.create({
                calendarid: "12345",
                calendarname: "testCalendar",
                calendardescription: "testCalendar",
                calendarowner: "testOwner"
            }).bind(this).then(function(calendar){
                expect(calendar.calendarid).to.equal('12345');
            })
        });
    });

    describe("Calendar Retrieval", function(){
        it("gets a calendar based on calendar ID", function(){
            return this.Calendar.findOne({
                where: {
                    calendarid: "12345"
                },
                raw: true
            }).bind(this).then(function(calendar){
                expect(calendar.calendardescription).to.equal('testCalendar');
            })
        });
    });
});