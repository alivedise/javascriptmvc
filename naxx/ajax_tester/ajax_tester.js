steal( 'jquery/controller','jquery/view/ejs', 'jquery/dom/cookie', 'steal/less', 'lib/cameraslider')
	.then( './ajax_tester.less' )
	.then( './views/init.ejs', function($){

/**
 * @class Naxx.AjaxTester
 */
$.Controller('Naxx.AjaxTester',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		$.cookie('nvr_user', 'admin');
		this.element.cameraslider();
	}
})

});
