steal("funcunit/qunit", "naxx/fixtures", "naxx/models/disk.js", function(){
	module("Model: Naxx.Models.Disk")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.Disk.findAll({}, function(disks){
			ok(disks)
	        ok(disks.length)
	        ok(disks[0].name)
	        ok(disks[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.Disk({name: "dry cleaning", description: "take to street corner"}).save(function(disk){
			ok(disk);
	        ok(disk.id);
	        equals(disk.name,"dry cleaning")
	        disk.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.Disk({name: "cook dinner", description: "chicken"}).
	            save(function(disk){
	            	equals(disk.description,"chicken");
	        		disk.update({description: "steak"},function(disk){
	        			equals(disk.description,"steak");
	        			disk.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.Disk({name: "mow grass", description: "use riding mower"}).
	            destroy(function(disk){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})