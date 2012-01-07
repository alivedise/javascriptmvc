steal('funcunit').then(function(){

module("External.Ocuload", { 
	setup: function(){
		S.open("//external/ocuload/ocuload.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Ocuload Demo","demo text");
});


});