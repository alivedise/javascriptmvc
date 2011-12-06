steal("funcunit/qunit", "naxx/fixtures", "naxx/models/protocol.js", function(){
	module("Model: Naxx.Models.Protocol")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Protocol.findAll({}, function(protocols){
			ok(protocols)
	        ok(protocols.length)
	        ok(protocols[0].name)
	        ok(protocols[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Protocol({name: "dry cleaning", description: "take to street corner"}).save(function(protocol){
			ok(protocol);
	        ok(protocol.id);
	        equals(protocol.name,"dry cleaning")
	        protocol.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Protocol({name: "cook dinner", description: "chicken"}).
	            save(function(protocol){
	            	equals(protocol.description,"chicken");
	        		protocol.update({description: "steak"},function(protocol){
	        			equals(protocol.description,"steak");
	        			protocol.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Protocol({name: "mow grass", description: "use riding mower"}).
	            destroy(function(protocol){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})