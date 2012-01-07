steal('funcunit').then(function(){

module("Naxx.Translate", { 
	setup: function(){
		S.open("//naxx/translate/translate.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.Translate Demo","demo text");
});


});