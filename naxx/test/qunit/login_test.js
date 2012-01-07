steal("funcunit/qunit", "naxx/fixtures", "naxx/models/login.js", function(){
	module("Model: Naxx.Login")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Login.findAll({}, function(logins){
			ok(logins)
	        ok(logins.length)
	        ok(logins[0].name)
	        ok(logins[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Login({name: "dry cleaning", description: "take to street corner"}).save(function(login){
			ok(login);
	        ok(login.id);
	        equals(login.name,"dry cleaning")
	        login.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Login({name: "cook dinner", description: "chicken"}).
	            save(function(login){
	            	equals(login.description,"chicken");
	        		login.update({description: "steak"},function(login){
	        			equals(login.description,"steak");
	        			login.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Login({name: "mow grass", description: "use riding mower"}).
	            destroy(function(login){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})