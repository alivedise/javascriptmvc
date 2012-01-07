steal('funcunit').then(function(){

module("External.Timepicker", { 
	setup: function(){
		S.open("//external/timepicker/timepicker.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Timepicker Demo","demo text");
});


});