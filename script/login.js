jQuery(function(){
	HeadLogin = function(){
		var $id = $("#id"),
			$pw = $("#pw"),
			$login = $("#login");
		if($id[0]==undefined || $pw[0]==undefined || $login[0]==undefined )
			return;
		var $profile = $("#profile");
		LoginEventAdd($id,$pw,$login,function(){
			$login.after("<img src='img/loading.gif' id='loading'></img>").hide();
		},function(){
			LoginEventRemove($id,$pw,$login);
			$profile.load("index.php #profile *");
			LOGIN_PROGRESS = setInterval(loginKeep,1000*60*60);
			$("#post_add .writer a").text(getCookie("user_nickname"));
		},function(){
			var id =$id.val(),
				pw =$pw.val();
			$profile.load("index.php #profile *",function(){
				$id.val(id);
				$pw.val(pw);
				HeadLogin();
			});
			
			miniPopup($("#login"),"id와 password가 맞지 않습니다.","head_alarm",3000);
		});
	}

	HeadLogin();

	if ( $("#profile progress")[0] != undefined ){
		LOGIN_PROGRESS = setInterval(loginKeep,1000*60*60);
	}

});	