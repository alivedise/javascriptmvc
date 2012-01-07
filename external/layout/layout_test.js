steal('funcunit').then(function(){

module("External.Layout", { 
	setup: function(){
		S.open("//external/layout/layout.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Layout Demo","demo text");
});


});