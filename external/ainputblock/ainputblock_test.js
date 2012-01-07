steal('funcunit').then(function(){

module("External.Ainputblock", { 
	setup: function(){
		S.open("//external/ainputblock/ainputblock.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Ainputblock Demo","demo text");
});


});