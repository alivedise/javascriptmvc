steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/controller/view',
	   'naxx/models' )
.then( './views/init.ejs', 
       './views/disk.ejs', 
       function($){

/**
 * @class Naxx.Disk.List
 * @parent index
 * @inherits jQuery.Controller
 * Lists disks and lets you destroy them.
 */
$.Controller('Naxx.Disk.List',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html(this.view('init',Naxx.Models.Disk.findAll()) )
	},
	'.destroy click': function( el ){
		if(confirm("Are you sure you want to destroy?")){
			el.closest('.disk').model().destroy();
		}
	},
	"{Naxx.Models.Disk} destroyed" : function(Disk, ev, disk) {
		disk.elements(this.element).remove();
	},
	"{Naxx.Models.Disk} created" : function(Disk, ev, disk){
		this.element.append(this.view('init', [disk]))
	},
	"{Naxx.Models.Disk} updated" : function(Disk, ev, disk){
		disk.elements(this.element)
		      .html(this.view('disk', disk) );
	}
});

});