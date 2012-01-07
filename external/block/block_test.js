steal('funcunit').then(function(){

module("External.Block", { 
	setup: function(){
		S.open("//external/block/block.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Block Demo","demo text");
});


});