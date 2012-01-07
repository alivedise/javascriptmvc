steal('funcunit').then(function(){

module("Vivotek.BasicForm", { 
	setup: function(){
		S.open("//vivotek/basic_form/basic_form.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Vivotek.BasicForm Demo","demo text");
});


});