$.validateFormDefaults = function(opts){
	$.validateFormOpt = opts;
}

$.fn.validateForm = function(opts){

	var settings = {
		'onError': function(errString){ alert("Form Error: "+errString); },
		'errorMsgs': {
			'filled': "The field must be filled",
			'integer': "You must prompt a valid integer"
		}
	};

	if($.validateFormOpt)
		$.extend(true, settings, $.validateFormOpt);

	if(opts)
		$.extend(true, settings, opts);

	var validations = {
		'filled': 	/^./,
		'integer': 	/^[\d]+$/,
	}

	return this.each(function(){
		var $this = $(this);

		$this.bind("submit", function(e){
			$this.find("input, select, textarea").each(function(){
				var field = $(this);
				for(v in validations){
					if(field.is(".validate-"+v)){
						if(!validations[v].test(field.val())){
							// Error!!
							settings.onError(settings.errorMsgs[v]);
							e.preventDefault();
						}
					}
				}
			});
		});

	});
}