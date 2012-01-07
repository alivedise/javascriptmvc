//steal/js naxx40/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/clean',function(){
	steal.clean('naxx40/naxx40.html',{
		indent_size: 1, 
		indent_char: '\t', 
		jslint : false,
		ignore: /jquery\/jquery.js/,
		predefined: {
			steal: true, 
			jQuery: true, 
			$ : true,
			window : true
			}
	});
});
