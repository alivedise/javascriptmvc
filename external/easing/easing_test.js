steal('funcunit').then(function(){

module("External.Easing", { 
	setup: function(){
		S.open("//external/easing/easing.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Easing Demo","demo text");
});


});