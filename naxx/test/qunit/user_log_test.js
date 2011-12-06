steal("funcunit/qunit", "naxx/fixtures", "naxx/models/user_log.js", function(){
	module("Model: Naxx.Models.UserLog")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.UserLog.findAll({}, function(user_logs){
			ok(user_logs)
	        ok(user_logs.length)
	        ok(user_logs[0].name)
	        ok(user_logs[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.UserLog({name: "dry cleaning", description: "take to street corner"}).save(function(user_log){
			ok(user_log);
	        ok(user_log.id);
	        equals(user_log.name,"dry cleaning")
	        user_log.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.UserLog({name: "cook dinner", description: "chicken"}).
	            save(function(user_log){
	            	equals(user_log.description,"chicken");
	        		user_log.update({description: "steak"},function(user_log){
	        			equals(user_log.description,"steak");
	        			user_log.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.UserLog({name: "mow grass", description: "use riding mower"}).
	            destroy(function(user_log){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})