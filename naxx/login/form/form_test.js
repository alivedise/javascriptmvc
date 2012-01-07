steal('funcunit').then(function(){

module("Naxx.Login.Form", { 
	setup: function(){
		S.open("//naxx/login/form/form.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.Login.Form Demo","demo text");
});


});