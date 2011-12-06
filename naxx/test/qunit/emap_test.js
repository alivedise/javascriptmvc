steal("funcunit/qunit", "naxx/fixtures", "naxx/models/emap.js", function(){
	module("Model: Naxx.Models.Emap")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Emap.findAll({}, function(emaps){
			ok(emaps)
	        ok(emaps.length)
	        ok(emaps[0].name)
	        ok(emaps[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Emap({name: "dry cleaning", description: "take to street corner"}).save(function(emap){
			ok(emap);
	        ok(emap.id);
	        equals(emap.name,"dry cleaning")
	        emap.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Emap({name: "cook dinner", description: "chicken"}).
	            save(function(emap){
	            	equals(emap.description,"chicken");
	        		emap.update({description: "steak"},function(emap){
	        			equals(emap.description,"steak");
	        			emap.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Emap({name: "mow grass", description: "use riding mower"}).
	            destroy(function(emap){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})