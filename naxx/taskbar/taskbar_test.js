steal('funcunit').then(function(){

module("Naxx.Taskbar", { 
	setup: function(){
		S.open("//naxx/taskbar/taskbar.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Naxx.Taskbar Demo","demo text");
});


});