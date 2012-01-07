steal('funcunit').then(function(){

module("External.Selectmenu", { 
	setup: function(){
		S.open("//external/selectmenu/selectmenu.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Selectmenu Demo","demo text");
});


});