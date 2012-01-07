steal('funcunit').then(function(){

module("External.SelectToUiSlider", { 
	setup: function(){
		S.open("//external/select_to_ui_slider/select_to_ui_slider.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "External.SelectToUiSlider Demo","demo text");
});


});