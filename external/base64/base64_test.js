steal('funcunit').then(function(){

module("External.Base64", { 
	setup: function(){
		S.open("//external/base64/base64.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Base64 Demo","demo text");
});


});