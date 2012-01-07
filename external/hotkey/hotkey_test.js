steal('funcunit').then(function(){

module("External.Hotkey", { 
	setup: function(){
		S.open("//external/hotkey/hotkey.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Hotkey Demo","demo text");
});


});