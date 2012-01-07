steal('funcunit').then(function(){

module("Naxx.Form.Combobox", { 
	setup: function(){
		S.open("//naxx/form/combobox/combobox.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.Form.Combobox Demo","demo text");
});


});