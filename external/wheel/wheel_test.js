steal('funcunit').then(function(){

module("External.Wheel", { 
	setup: function(){
		S.open("//external/wheel/wheel.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Wheel Demo","demo text");
});


});