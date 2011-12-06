steal('funcunit',function(){

module("Naxx.AlarmData.List", { 
	setup: function(){
		S.open("//naxx/alarm_data/list/list.html");
	}
});

test("delete alarm_datas", function(){
	S('#create').click()
	
	// wait until grilled cheese has been added
	S('h3:contains(Grilled Cheese X)').exists();
	
	S.confirm(true);
	S('h3:last a').click();
	
	
	S('h3:contains(Grilled Cheese)').missing(function(){
		ok(true,"Grilled Cheese Removed")
	});
	
});


});