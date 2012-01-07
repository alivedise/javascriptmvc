steal('funcunit').then(function(){

module("Vivotek.Grid", { 
	setup: function(){
		S.open("//vivotek/grid/grid.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Vivotek.Grid Demo","demo text");
});


});