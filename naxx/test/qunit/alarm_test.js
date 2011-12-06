steal("funcunit/qunit", "naxx/fixtures", "naxx/models/alarm.js", function(){
	module("Model: Naxx.Models.Alarm")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Alarm.findAll({}, function(alarms){
			ok(alarms)
	        ok(alarms.length)
	        ok(alarms[0].name)
	        ok(alarms[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Alarm({name: "dry cleaning", description: "take to street corner"}).save(function(alarm){
			ok(alarm);
	        ok(alarm.id);
	        equals(alarm.name,"dry cleaning")
	        alarm.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Alarm({name: "cook dinner", description: "chicken"}).
	            save(function(alarm){
	            	equals(alarm.description,"chicken");
	        		alarm.update({description: "steak"},function(alarm){
	        			equals(alarm.description,"steak");
	        			alarm.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Alarm({name: "mow grass", description: "use riding mower"}).
	            destroy(function(alarm){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})