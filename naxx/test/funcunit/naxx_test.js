steal("funcunit", function(){
	module("naxx test", { 
		setup: function(){
			S.open("//naxx/naxx.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})