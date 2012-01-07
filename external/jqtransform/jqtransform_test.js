steal('funcunit').then(function(){

module("External.Jqtransform", { 
	setup: function(){
		S.open("//external/jqtransform/jqtransform.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Jqtransform Demo","demo text");
});


});