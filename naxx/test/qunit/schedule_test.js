steal("funcunit/qunit", "naxx/fixtures", "naxx/models/schedule.js", function(){
	module("Model: Naxx.Models.Schedule")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Schedule.findAll({}, function(schedules){
			ok(schedules)
	        ok(schedules.length)
	        ok(schedules[0].name)
	        ok(schedules[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Schedule({name: "dry cleaning", description: "take to street corner"}).save(function(schedule){
			ok(schedule);
	        ok(schedule.id);
	        equals(schedule.name,"dry cleaning")
	        schedule.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Schedule({name: "cook dinner", description: "chicken"}).
	            save(function(schedule){
	            	equals(schedule.description,"chicken");
	        		schedule.update({description: "steak"},function(schedule){
	        			equals(schedule.description,"steak");
	        			schedule.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Schedule({name: "mow grass", description: "use riding mower"}).
	            destroy(function(schedule){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})