steal("funcunit/qunit", "naxx/fixtures", "naxx/models/profile.js", function(){
	module("Model: Naxx.Models.Profile")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Profile.findAll({}, function(profiles){
			ok(profiles)
	        ok(profiles.length)
	        ok(profiles[0].name)
	        ok(profiles[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Profile({name: "dry cleaning", description: "take to street corner"}).save(function(profile){
			ok(profile);
	        ok(profile.id);
	        equals(profile.name,"dry cleaning")
	        profile.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Profile({name: "cook dinner", description: "chicken"}).
	            save(function(profile){
	            	equals(profile.description,"chicken");
	        		profile.update({description: "steak"},function(profile){
	        			equals(profile.description,"steak");
	        			profile.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Profile({name: "mow grass", description: "use riding mower"}).
	            destroy(function(profile){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})