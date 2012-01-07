steal('funcunit').then(function(){

module("Naxx.User.Form", { 
	setup: function(){
		S.open("//naxx/user/form/form.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.User.Form Demo","demo text");
});


});