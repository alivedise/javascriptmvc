steal("funcunit/qunit", "naxx/fixtures", "naxx/models/log.js", function(){
	module("Model: Naxx.Models.Log")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Log.findAll({}, function(logs){
			ok(logs)
	        ok(logs.length)
	        ok(logs[0].name)
	        ok(logs[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Log({name: "dry cleaning", description: "take to street corner"}).save(function(log){
			ok(log);
	        ok(log.id);
	        equals(log.name,"dry cleaning")
	        log.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Log({name: "cook dinner", description: "chicken"}).
	            save(function(log){
	            	equals(log.description,"chicken");
	        		log.update({description: "steak"},function(log){
	        			equals(log.description,"steak");
	        			log.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Log({name: "mow grass", description: "use riding mower"}).
	            destroy(function(log){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})