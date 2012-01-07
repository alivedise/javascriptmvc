steal('funcunit').then(function(){

module("Naxx.User.Grid", { 
	setup: function(){
		S.open("//naxx/user/grid/grid.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.User.Grid Demo","demo text");
});


});