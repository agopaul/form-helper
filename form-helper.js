$.validateFormDefaults = function(opts){
	$.validateFormOpt = opts;
}

$.fn.validateForm = function(opts){

	var settings = {
		onError: function(errString){ alert("Form Error: "+errString); },
		errorMsgs: {
			filled: "The field must be filled",
			integer: "You must prompt a valid integer",
			email: "You must prompt a valid email"
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

	return this.each(function(){
		var $this = $(this);

		// Fire the callback for each field
		$this.find("input, select, textarea").each(function(){
			var field = $(this);
			for(v in validations){
				if(field.is(".validate-"+v)){
					settings.eachField(field);
				}
			}
		});

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