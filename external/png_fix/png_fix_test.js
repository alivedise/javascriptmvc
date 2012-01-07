steal('funcunit').then(function(){

module("External.PngFix", { 
	setup: function(){
		S.open("//external/png_fix/png_fix.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.PngFix Demo","demo text");
});


});