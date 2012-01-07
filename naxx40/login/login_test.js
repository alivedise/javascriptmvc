steal('funcunit').then(function(){

module("Naxx40.Login", { 
	setup: function(){
		S.open("//naxx40/login/login.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx40.Login Demo","demo text");
});


});