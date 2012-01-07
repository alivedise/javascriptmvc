steal("funcunit", function(){
	module("naxx40 test", { 
		setup: function(){
			S.open("//naxx40/naxx40.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})