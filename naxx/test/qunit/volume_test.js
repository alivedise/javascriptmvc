steal("funcunit/qunit", "naxx/fixtures", "naxx/models/volume.js", function(){
	module("Model: Naxx.Models.Volume")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Volume.findAll({}, function(volumes){
			ok(volumes)
	        ok(volumes.length)
	        ok(volumes[0].name)
	        ok(volumes[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Volume({name: "dry cleaning", description: "take to street corner"}).save(function(volume){
			ok(volume);
	        ok(volume.id);
	        equals(volume.name,"dry cleaning")
	        volume.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Volume({name: "cook dinner", description: "chicken"}).
	            save(function(volume){
	            	equals(volume.description,"chicken");
	        		volume.update({description: "steak"},function(volume){
	        			equals(volume.description,"steak");
	        			volume.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Volume({name: "mow grass", description: "use riding mower"}).
	            destroy(function(volume){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})