jQuery(function(){
	$("#logo").click(function(){
		location.replace("");
	});

	//$.loadPopup("postView.htm");
	
    $(window).on("beforeunload", function(){
        if(checkUnload("#post_add")) return "이 페이지를 벗어나면 작성중인 내용은 저장되지 않는당께.\n가지마랑께ㅠㅠ";
    });
});