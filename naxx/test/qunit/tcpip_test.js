steal("funcunit/qunit", "naxx/fixtures", "naxx/models/tcpip.js", function(){
	module("Model: Naxx.Models.Tcpip")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Tcpip.findAll({}, function(tcpips){
			ok(tcpips)
	        ok(tcpips.length)
	        ok(tcpips[0].name)
	        ok(tcpips[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Tcpip({name: "dry cleaning", description: "take to street corner"}).save(function(tcpip){
			ok(tcpip);
	        ok(tcpip.id);
	        equals(tcpip.name,"dry cleaning")
	        tcpip.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Tcpip({name: "cook dinner", description: "chicken"}).
	            save(function(tcpip){
	            	equals(tcpip.description,"chicken");
	        		tcpip.update({description: "steak"},function(tcpip){
	        			equals(tcpip.description,"steak");
	        			tcpip.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Tcpip({name: "mow grass", description: "use riding mower"}).
	            destroy(function(tcpip){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})