steal("funcunit/qunit", "naxx/fixtures", "naxx/models/encoder.js", function(){
	module("Model: Naxx.Models.Encoder")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Encoder.findAll({}, function(encoders){
			ok(encoders)
	        ok(encoders.length)
	        ok(encoders[0].name)
	        ok(encoders[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Encoder({name: "dry cleaning", description: "take to street corner"}).save(function(encoder){
			ok(encoder);
	        ok(encoder.id);
	        equals(encoder.name,"dry cleaning")
	        encoder.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Encoder({name: "cook dinner", description: "chicken"}).
	            save(function(encoder){
	            	equals(encoder.description,"chicken");
	        		encoder.update({description: "steak"},function(encoder){
	        			equals(encoder.description,"steak");
	        			encoder.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Encoder({name: "mow grass", description: "use riding mower"}).
	            destroy(function(encoder){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})