steal('funcunit').then(function(){

module("External.Canvas", { 
	setup: function(){
		S.open("//external/canvas/canvas.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Canvas Demo","demo text");
});


});