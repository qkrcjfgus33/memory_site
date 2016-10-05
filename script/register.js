jQuery(function(){
	//가입 팝업 열기
	$("#register").on("click",function(){
		console.log("#register");
		var reg_check = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{6,15}$/,//6~15자이내의 한글,영어,숫자,_
			reg_nick = /^[\wㄱ-ㅎㅏ-ㅣ가-힣]{1,10}$/;//1~10자 이내의 한글,영어,숫자,_

		function registerButtonChange(){
			var id = $("#register_id").val(),
				pw = $("#register_pw").val();
			if(reg_check.test(pw) && reg_check.test(id) ) {
				$("#register_button").attr("disabled",false);
				return true
			}else{
				$("#register_button").attr("disabled",true);
				return false
			}
		}

		//아이디 유효성 및 중복검사 함수
		function registerIdCheck(){
			var id = $("#register_id").val();

			if( reg_check.test(id) ){
				miniPopup("#register_id","ID중복체크중...","register_id_alram");
				$.get("./php/idCheck.php",{check_id:id},function(data,status){
					if(status != "success"){
						miniPopup("#register_id","서버와의 상태가 좋지 않아 아이디 중복 체크에 실패하였습니다. 죄송합니다.","register_id_alram",5000);
						$("#register_id").css("background-color","#ff5b60");
						$("#register_button").attr("disabled",true);
						return;
					} else {
						if(data){
							miniPopup("#register_id","사용 가능한 아이디 입니다","register_id_alram",1000 );
							registerButtonChange();
							return;
						}else {
							miniPopup("#register_id","중복으로 사용 불가능한 아이디 입니다","register_id_alram",3000 );
							$("#register_id").css("background-color","#ff5b60");
							$("#register_button").attr("disabled",true);
							return;
						}
					}
				});
			}else{
				miniPopup("#register_id", "id는 6~15이내의 </br>한글,영어,_ 여야 합니다.", "register_id_alram",3000);
				$("#register_id").css("background-color","#ff5b60");
				$("#register_button").attr("disabled",true);
				return false;
			}
		}

		//비번 유효성 검사 함수
		function registerPwCheck(){
			var pw = $("#register_pw").val();
			if( reg_check.test(pw) ){
				return true;
			}else
				miniPopup("#register_pw", "password는 6~15이내의 </br>한글,영어,_ 여야 합니다.", "register_pw_alram",3000);
				$("#register_pw").css("background-color","#ff5b60");
				return false;
		}

		//닉네임 유효성 및 중복검사 함수
		function registerNicknameCheck(){
			var nickname = $("#register_nickname").val();

			if( reg_nick.test(nickname) ){
				miniPopup("#register_nickname","Nickname중복체크중...","register_nickname_alram");
				$.get("./php/nicknameCheck.php",{check_nickname:nickname},function(data,status){
					if(status != "success"){
						miniPopup("#register_nickname","서버와의 상태가 좋지 않아 아이디 중복 체크에 실패하였습니다. 죄송합니다.","register_nickname_alram",5000);
						$("#register_nickname").css("background-color","#ff5b60");
						$("#register_button").attr("disabled",true);
						return;
					} else {
						if(data){
							miniPopup("#register_nickname","사용 가능한 닉네임 입니다","register_nickname_alram",1000 );
							registerButtonChange();
							return;
						}else {
							miniPopup("#register_nickname","중복으로 사용 불가능한 닉네임 입니다","register_nickname_alram",3000 );
							$("#register_nickname").css("background-color","#ff5b60");
							$("#register_button").attr("disabled",true);
							return;
						}
					}
				});
				return;
			}else{
				miniPopup("#register_nickname", "Nickname의 길이는 1~10</br>이내여야 합니다.", "register_nickname_alram",3000);
				$("#register_nickname").css("background-color","#ff5b60");
				$("#register_button").attr("disabled",true);
				return false;
			}
		}

		//최종 가입 함수
		function registerCheck(){
			//이벤트 해제.
			$("#register_popup").off(".register").
				find("input").attr("disabled",true);
			$("#register_button").off(".register");
			var id = $("#register_id").val(),
				pw = $("#register_pw").val(),
				nickname = $("#register_nickname").val();

			if(reg_check.test(id) && reg_check.test(pw) && reg_nick.test(nickname)){
				$.post("./php/register.php",{register_id:id, register_pw:pw, register_nickname:nickname},function(data,status){
					if(status != "success"){
						miniPopup("#register_button","서버와의 상태가 좋지 않아 아이디 중복 체크에 실패하였습니다. 죄송합니다.","register_alram",5000);
						return false;
					}else{
						if(data != "success"){//중복, 서버검사에 통과하지 못했을경우.
							miniPopup("#register_button",data,"register_alram",5000);
							$("#register_popup").find("input:not(#register_button)").attr("disabled",false);
							registerEvnetOn();
							registerIdCheck();
							registerPwCheck();
							return false;
						} else{//가입 성공시.
							miniPopup("html",nickname+"님 가입을 축하드립니다.","head_alarm",5000,$("#register").offset().top,parseInt($("#register").offset().left)+100);
							//가입팝업 닫기
							$("#register_popup").slideUp(500,function(){$(this).remove()});
							return true;
						}
					}
				});
			}else{//검사를 통과 못했을시
				$("#register_popup").find("input:not(#register_button)").attr("disabled",false);
				registerEvnetOn();
				registerIdCheck();
				registerPwCheck();
				return false;
			}

		}
		//foucs,blur 지정. 및 엔터이벤트 등록
		registerEvnetOn = function(){
			console.log("registerEvnetOn");
			$("#register_popup #register_id,#register_popup #register_pw,#register_popup #register_nickname").on("focus.register",function(e) {
				console.log("focus.register");
				$(e.currentTarget).css("background-color","#ffffff");
				$("#"+$(e.currentTarget).attr("id")+"_alram").fadeIn(300).remove();
			}).on("blur.register",function(e) {
				console.log("blur.register");
				switch($(e.currentTarget).attr("id")){
					case "register_id" : registerIdCheck();
					break;
					case "register_pw" : registerPwCheck();
					break;
					case "register_nickname" : registerNicknameCheck();
					break;
				}
				registerButtonChange();
			}).on("keyup.register",function(e) {
				console.log("keyup.register");
				if(registerButtonChange()){//각 값들을 체크하고.
					if(e.which == 13 ) {//enter를 눌렀을시
						registerCheck()
						return;
					}
				}
			});
			//최종 가입(버튼을 눌렀을시)
			$("#register_button").on("click.register",registerCheck);
		}
		$.loadPopup("register.htm",{id:"register_popup",fn:registerEvnetOn});//팝업 생성

		
	});
});