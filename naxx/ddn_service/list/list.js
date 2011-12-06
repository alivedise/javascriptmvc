steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/ddn_service.ejs', 
       function($){

/**
 * @class Naxx.DDNService.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists ddn_services and lets you destroy them.
 */
$.Controller('Naxx.DDNService.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.DDNService.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.ddn_service').model().destroy();
		}
	},
	"{Naxx.Models.DDNService} destroyed" : function(DDNService, ev, ddn_service) {
		ddn_service.elements(this.element).remove();
	},
	"{Naxx.Models.DDNService} created" : function(DDNService, ev, ddn_service){
		this.element.append(this.view('init', [ddn_service]))
	},
	"{Naxx.Models.DDNService} updated" : function(DDNService, ev, ddn_service){
		ddn_service.elements(this.element)
		      .html(this.view('ddn_service', ddn_service) );
	}
});

});