steal("funcunit/qunit", "naxx/fixtures", "naxx/models/iptable.js", function(){
	module("Model: Naxx.Models.Iptable")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Iptable.findAll({}, function(iptables){
			ok(iptables)
	        ok(iptables.length)
	        ok(iptables[0].name)
	        ok(iptables[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Iptable({name: "dry cleaning", description: "take to street corner"}).save(function(iptable){
			ok(iptable);
	        ok(iptable.id);
	        equals(iptable.name,"dry cleaning")
	        iptable.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Iptable({name: "cook dinner", description: "chicken"}).
	            save(function(iptable){
	            	equals(iptable.description,"chicken");
	        		iptable.update({description: "steak"},function(iptable){
	        			equals(iptable.description,"steak");
	        			iptable.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Iptable({name: "mow grass", description: "use riding mower"}).
	            destroy(function(iptable){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})