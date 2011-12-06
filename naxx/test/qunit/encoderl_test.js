steal("funcunit/qunit", "naxx/fixtures", "naxx/models/encoderl.js", function(){
	module("Model: Naxx.Models.Encoderl")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Encoderl.findAll({}, function(encoderls){
			ok(encoderls)
	        ok(encoderls.length)
	        ok(encoderls[0].name)
	        ok(encoderls[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Encoderl({name: "dry cleaning", description: "take to street corner"}).save(function(encoderl){
			ok(encoderl);
	        ok(encoderl.id);
	        equals(encoderl.name,"dry cleaning")
	        encoderl.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Encoderl({name: "cook dinner", description: "chicken"}).
	            save(function(encoderl){
	            	equals(encoderl.description,"chicken");
	        		encoderl.update({description: "steak"},function(encoderl){
	        			equals(encoderl.description,"steak");
	        			encoderl.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Encoderl({name: "mow grass", description: "use riding mower"}).
	            destroy(function(encoderl){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})