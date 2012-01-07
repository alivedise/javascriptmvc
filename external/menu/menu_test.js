steal('funcunit').then(function(){

module("External.Menu", { 
	setup: function(){
		S.open("//external/menu/menu.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Menu Demo","demo text");
});


});