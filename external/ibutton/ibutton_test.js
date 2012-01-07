steal('funcunit').then(function(){

module("External.Ibutton", { 
	setup: function(){
		S.open("//external/ibutton/ibutton.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Ibutton Demo","demo text");
});


});