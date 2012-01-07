steal("funcunit/qunit", "naxx/fixtures", "naxx/models/accesslist.js", function(){
	module("Model: Naxx.Models.Accesslist")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Accesslist.findAll({}, function(accesslists){
			ok(accesslists)
	        ok(accesslists.length)
	        ok(accesslists[0].name)
	        ok(accesslists[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Accesslist({name: "dry cleaning", description: "take to street corner"}).save(function(accesslist){
			ok(accesslist);
	        ok(accesslist.id);
	        equals(accesslist.name,"dry cleaning")
	        accesslist.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Accesslist({name: "cook dinner", description: "chicken"}).
	            save(function(accesslist){
	            	equals(accesslist.description,"chicken");
	        		accesslist.update({description: "steak"},function(accesslist){
	        			equals(accesslist.description,"steak");
	        			accesslist.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Accesslist({name: "mow grass", description: "use riding mower"}).
	            destroy(function(accesslist){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})