jQuery(function(){
	$("#profile").on("click","#logout",function(){
		$.get("./php/logout.php",{},function(data,status){
			clearInterval(LOGIN_PROGRESS);
			LoginEventRemove();
			$("#profile").load("index.php #profile *",HeadLogin);
		});
	});
	
})