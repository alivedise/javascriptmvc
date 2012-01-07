steal('funcunit').then(function(){

module("External.Ipaddress", { 
	setup: function(){
		S.open("//external/ipaddress/ipaddress.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.Ipaddress Demo","demo text");
});


});