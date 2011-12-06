steal("funcunit/qunit", "naxx/fixtures", "naxx/models/vision.js", function(){
	module("Model: Naxx.Models.Vision")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Vision.findAll({}, function(visions){
			ok(visions)
	        ok(visions.length)
	        ok(visions[0].name)
	        ok(visions[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Vision({name: "dry cleaning", description: "take to street corner"}).save(function(vision){
			ok(vision);
	        ok(vision.id);
	        equals(vision.name,"dry cleaning")
	        vision.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Vision({name: "cook dinner", description: "chicken"}).
	            save(function(vision){
	            	equals(vision.description,"chicken");
	        		vision.update({description: "steak"},function(vision){
	        			equals(vision.description,"steak");
	        			vision.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Vision({name: "mow grass", description: "use riding mower"}).
	            destroy(function(vision){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})