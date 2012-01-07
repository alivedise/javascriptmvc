steal( 'jquery/controller','jquery/view/ejs','mxui/data/grid')
	.then( './views/init.ejs', function($){

/**
 * @class Vivotek.Grid
 */
$.Controller('Vivotek.Grid',
/** @Static */
{
	defaults : {
		model: null,
		form: null,
		params: null
		create: null,
		edit: null
	}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//vivotek/grid/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});
