var placeholderSetting;
jQuery(function(){
placeholderSetting = function(){
	if (!("placeholder" in document.createElement("input"))) { 
        $("textarea[placeholder],input[placeholder]").
			data("placeholder_set",true).
			each(function(){
			$(this).val($(this).attr("placeholder")).
				data("pre_color",$(this).css("color")).
				css("color","#cecece");
        }).keyup(function (e) {
            if($(e.target).val()=="")
				$(e.target).data("placeholder_set",true);
			else
				$(e.target).data("placeholder_set",false);
		}).focus(function(e){
			if($(e.target).data("placeholder_set") && $(e.target).val()=="")
				$(e.target).val($(this).attr("placeholder"));	
        }).blur(function (e) {
            if($(e.target).data("placeholder_set") && $(e.target).val()=="")
				$(e.target).val($(this).attr("placeholder"));	
        });
    }
}
placeholderSetting();
})