steal('funcunit').then(function(){

module("External.Datepicker", { 
	setup: function(){
		S.open("//external/datepicker/datepicker.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Datepicker Demo","demo text");
});


});