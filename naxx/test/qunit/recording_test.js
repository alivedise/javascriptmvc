steal("funcunit/qunit", "naxx/fixtures", "naxx/models/recording.js", function(){
	module("Model: Naxx.Models.Recording")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Recording.findAll({}, function(recordings){
			ok(recordings)
	        ok(recordings.length)
	        ok(recordings[0].name)
	        ok(recordings[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Recording({name: "dry cleaning", description: "take to street corner"}).save(function(recording){
			ok(recording);
	        ok(recording.id);
	        equals(recording.name,"dry cleaning")
	        recording.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Recording({name: "cook dinner", description: "chicken"}).
	            save(function(recording){
	            	equals(recording.description,"chicken");
	        		recording.update({description: "steak"},function(recording){
	        			equals(recording.description,"steak");
	        			recording.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Recording({name: "mow grass", description: "use riding mower"}).
	            destroy(function(recording){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})