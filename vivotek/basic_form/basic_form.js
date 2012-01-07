steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

/**
 * @class Vivotek.BasicForm
 */
$.Controller('Vivotek.BasicForm',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//vivotek/basic_form/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});