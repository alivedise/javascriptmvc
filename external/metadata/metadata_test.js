steal('funcunit').then(function(){

module("External.Metadata", { 
	setup: function(){
		S.open("//external/metadata/metadata.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Metadata Demo","demo text");
});


});