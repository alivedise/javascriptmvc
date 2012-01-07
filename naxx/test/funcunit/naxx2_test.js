steal("funcunit", function(){
	module("naxx2 test", { 
		setup: function(){
			S.open("//naxx2/naxx2.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})