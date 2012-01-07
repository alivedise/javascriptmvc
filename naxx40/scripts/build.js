//steal/js naxx40/scripts/compress.js

load("steal/rhino/rhino.js");
steal('steal/build').then('steal/build/scripts','steal/build/styles',function(){
	steal.build('naxx40/scripts/build.html',{to: 'naxx40'});
});
