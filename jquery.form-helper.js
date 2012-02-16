/*
 * jQuery Form Helper
 * https://github.com/agopaul/form-helper
 *
 * Copyright 2011, Paolo Agostinetto
 *
 */

$.validateFormDefaults = function(opts){
	$.validateFormOpt = opts;
}

$.fn.validateForm = function(opts){

	var settings = {
		onError: function(errString, field){ alert("Form Error: "+errString+" value: "+field); },
		onSubmit: function(form){},
		errorMsgs: {
			'filled': "The field must be filled",
			'integer': "You must prompt a valid integer",
			'email': "You must prompt a valid email",
			'at-least-one-checked': "You should check at least one option",
			'radio-checked': "Youshould check an option"
		},
		eachField: function(obj){}
	};

	if($.validateFormOpt)
		$.extend(true, settings, $.validateFormOpt);

	if(opts)
		$.extend(true, settings, opts);

	var validations = {
		'filled': 	/^./,
		'integer': 	/^[\d]+$/,
		'email': 	/^[\w_\-\.]+@[\w_\-\.]+\.[\w]{2,3}$/,
	}

	var alternateValidations = {
		'at-least-one-checked': function(field){
			var name = field.attr("name");
			if($('input[name='+name+']:checked').length<1){
				return false;
			}
			return true;
		},
		'radio-checked': function(field){
			if(field.is(':checked')){
				return true;
			}
			return false;
		}
	}

	return this.each(function(){
		var $this = $(this);
		var app = {};

		// Fire the callback for each field
		$this.find("input, select, textarea").not(":disabled").each(function(){
			var field = $(this);

			$.extend(app, validations, alternateValidations)
			for(v in app){
				if(field.is(".validate-"+v)){
					settings.eachField(field);
				}
			}
		});

		$this.bind("submit", function(e){

			settings.onSubmit();
			
			$this.find("input, select, textarea").not(":disabled").each(function(){
				var field = $(this);

				for(v in app){
					if(field.is(".validate-"+v)){
						if(typeof validations[v] == "object"){
							if(!validations[v].test(field.val())){
								// Error!!
								settings.onError(settings.errorMsgs[v], field);
								e.preventDefault();
							}
						}
						else if(alternateValidations[v]){
							if(!alternateValidations[v](field)){
								// Error!!
								settings.onError(settings.errorMsgs[v], field);
								e.preventDefault();
							}
						}
					}
				}
			});
		});

	});
}
