steal('funcunit').then(function(){

module("External.Validate", { 
	setup: function(){
		S.open("//external/validate/validate.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Validate Demo","demo text");
});


});