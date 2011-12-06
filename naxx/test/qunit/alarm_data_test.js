steal("funcunit/qunit", "naxx/fixtures", "naxx/models/alarm_data.js", function(){
	module("Model: Naxx.Models.AlarmData")
	
	test("findAll", function(){
		expect(4);
		stop();
		Naxx.Models.AlarmData.findAll({}, function(alarm_datas){
			ok(alarm_datas)
	        ok(alarm_datas.length)
	        ok(alarm_datas[0].name)
	        ok(alarm_datas[0].description)
			start();
		});
		
	})
	
	test("create", function(){
		expect(3)
		stop();
		new Naxx.Models.AlarmData({name: "dry cleaning", description: "take to street corner"}).save(function(alarm_data){
			ok(alarm_data);
	        ok(alarm_data.id);
	        equals(alarm_data.name,"dry cleaning")
	        alarm_data.destroy()
			start();
		})
	})
	test("update" , function(){
		expect(2);
		stop();
		new Naxx.Models.AlarmData({name: "cook dinner", description: "chicken"}).
	            save(function(alarm_data){
	            	equals(alarm_data.description,"chicken");
	        		alarm_data.update({description: "steak"},function(alarm_data){
	        			equals(alarm_data.description,"steak");
	        			alarm_data.destroy();
						start();
	        		})
	            })
	
	});
	test("destroy", function(){
		expect(1);
		stop();
		new Naxx.Models.AlarmData({name: "mow grass", description: "use riding mower"}).
	            destroy(function(alarm_data){
	            	ok( true ,"Destroy called" )
					start();
	            })
	})
})