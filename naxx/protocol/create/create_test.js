steal('funcunit',function(){

module("Naxx.Protocol.Create", { 
	setup: function(){
		S.open("//naxx/protocol/create/create.html");
	}
});

test("create protocols", function(){
	S("[name=name]").type("Ice Water");
	S("[name=description]").type("Pour water in a glass. Add ice cubes.");
	S("[type=submit]").click();
	S('h3:contains(Ice Water)')
		.exists(function(){
			ok(true, "Ice Water added");
			equals(S("[name=name]").val() , "", "form reset");
			equals(S("[name=description]").val() , "", "form reset");
		})
});


});