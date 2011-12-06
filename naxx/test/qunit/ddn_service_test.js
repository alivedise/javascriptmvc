steal("funcunit/qunit", "naxx/fixtures", "naxx/models/ddn_service.js", function(){
	module("Model: Naxx.Models.DDNService")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.DDNService.findAll({}, function(ddn_services){
			ok(ddn_services)
	        ok(ddn_services.length)
	        ok(ddn_services[0].name)
	        ok(ddn_services[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.DDNService({name: "dry cleaning", description: "take to street corner"}).save(function(ddn_service){
			ok(ddn_service);
	        ok(ddn_service.id);
	        equals(ddn_service.name,"dry cleaning")
	        ddn_service.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.DDNService({name: "cook dinner", description: "chicken"}).
	            save(function(ddn_service){
	            	equals(ddn_service.description,"chicken");
	        		ddn_service.update({description: "steak"},function(ddn_service){
	        			equals(ddn_service.description,"steak");
	        			ddn_service.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.DDNService({name: "mow grass", description: "use riding mower"}).
	            destroy(function(ddn_service){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})