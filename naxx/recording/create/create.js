steal( 'jquery/controller',
       'jquery/view/ejs',
	   'jquery/dom/form_params',
	   'jquery/controller/view',
	   'naxx/models' )
	.then('./views/init.ejs', function($){

/**
 * @class Naxx.Recording.Create
 * @parent index
 * @inherits jQuery.Controller
 * Creates recordings
 */
$.Controller('Naxx.Recording.Create',
/** @Prototype */
{
	init : function(){
		this.element.html(this.view());
	},
	submit : function(el, ev){
		ev.preventDefault();
		this.element.find('[type=submit]').val('Creating...')
		new Naxx.Models.Recording(el.formParams()).save(this.callback('saved'));
	},
	saved : function(){
		this.element.find('[type=submit]').val('Create');
		this.element[0].reset()
	}
})

});