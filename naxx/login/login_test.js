steal('funcunit').then(function(){

module("Naxx.Login", { 
	setup: function(){
		S.open("//naxx/login/login.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.Login Demo","demo text");
});


});