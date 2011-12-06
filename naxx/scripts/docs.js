//js naxx/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('naxx/naxx.html', {
		markdown : ['naxx']
	});
});