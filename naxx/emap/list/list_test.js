steal('funcunit',function(){

module("Naxx.Emap.List", { 
	setup: function(){
		S.open("//naxx/emap/list/list.html");
	}
});

test("delete emaps", function(){
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