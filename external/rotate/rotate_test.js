steal('funcunit').then(function(){

module("External.Rotate", { 
	setup: function(){
		S.open("//external/rotate/rotate.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Rotate Demo","demo text");
});


});