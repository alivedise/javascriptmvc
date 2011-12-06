steal("funcunit/qunit", "naxx/fixtures", "naxx/models/camera_log.js", function(){
	module("Model: Naxx.Models.CameraLog")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.CameraLog.findAll({}, function(camera_logs){
			ok(camera_logs)
	        ok(camera_logs.length)
	        ok(camera_logs[0].name)
	        ok(camera_logs[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.CameraLog({name: "dry cleaning", description: "take to street corner"}).save(function(camera_log){
			ok(camera_log);
	        ok(camera_log.id);
	        equals(camera_log.name,"dry cleaning")
	        camera_log.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.CameraLog({name: "cook dinner", description: "chicken"}).
	            save(function(camera_log){
	            	equals(camera_log.description,"chicken");
	        		camera_log.update({description: "steak"},function(camera_log){
	        			equals(camera_log.description,"steak");
	        			camera_log.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.CameraLog({name: "mow grass", description: "use riding mower"}).
	            destroy(function(camera_log){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})