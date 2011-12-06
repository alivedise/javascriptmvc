steal("funcunit/qunit", "naxx/fixtures", "naxx/models/system_log.js", function(){
	module("Model: Naxx.Models.SystemLog")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.SystemLog.findAll({}, function(system_logs){
			ok(system_logs)
	        ok(system_logs.length)
	        ok(system_logs[0].name)
	        ok(system_logs[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.SystemLog({name: "dry cleaning", description: "take to street corner"}).save(function(system_log){
			ok(system_log);
	        ok(system_log.id);
	        equals(system_log.name,"dry cleaning")
	        system_log.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.SystemLog({name: "cook dinner", description: "chicken"}).
	            save(function(system_log){
	            	equals(system_log.description,"chicken");
	        		system_log.update({description: "steak"},function(system_log){
	        			equals(system_log.description,"steak");
	        			system_log.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.SystemLog({name: "mow grass", description: "use riding mower"}).
	            destroy(function(system_log){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})