steal('funcunit').then(function(){

module("External.Pnotify", { 
	setup: function(){
		S.open("//external/pnotify/pnotify.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Pnotify Demo","demo text");
});


});