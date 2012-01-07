steal('funcunit').then(function(){

module("Naxx.AjaxTester", { 
	setup: function(){
		S.open("//naxx/ajax_tester/ajax_tester.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.AjaxTester Demo","demo text");
});


});