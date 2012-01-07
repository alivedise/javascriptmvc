steal( 'jquery','jquery/controller','jquery/view/ejs','steal/less','mxui/form/combobox','mxui/form/combobox/combobox.css','naxx/models','jquery/model/validations','lib/common','jquery/dom/form_params')
	.then('vivotek/basic_form/basic_form.less')
	.then( './views/init.ejs', function($){

/**
 * @class Naxx.User.Form
 */
$.Controller('Naxx.User.Form',
/** @Static */
{
	defaults : {
		model: null,
	},
	combobox: []
},
/** @Prototype */
{
	init : function(){
		this.element.html("//naxx/user/form/views/init.ejs",{
			message: "Hello World",
		});
		$("#group").mxui_form_combobox({
			items: [
				{ value: "0", text: "Administrator", enabled: true, selected: true },
				{ value: "1", text: "Operator", enabled: true, selected: true }
			]
		});
		$("#encoder").mxui_form_combobox({
		});
	},
	'change': function(el, ev, item)
	{
		var user = new Naxx.Models.User(el.formParams());
		user.attrs(el.formParams(), this.callback('saved'), this.callback("renderErrors"));
	},
	saved: function(a,b,c){
		steal.dev.log(a,b,c);
	},
	renderErrors: function(a,b,c){
		steal.dev.log(a,b,c);
	}

})

});
