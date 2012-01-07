//js naxx40/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('naxx40/naxx40.html', {
		markdown : ['naxx40']
	});
});