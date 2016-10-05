/*전역 변수 모음*/
if( window.console == undefined ) { console = {log : function(){} }; }

var undefined, //undefined
	CHOSE_MENUS = new Array(),//선택된 메뉴 집합 배열					divisionMenu.js , post_add.js 에서 사용.
	VIEW_POST = new Array(),
	CATEGORY_CHOSE=null, //선택된 카테고리 index
	POST_ADD_UL,//index상에서 post_add 아이디 태그 안의 <ul>안의 html문자열.divisionMenu.js 에서 사용.
	reply_add_html,
	LOGIN_PROGRESS,//로그인 유지 시간을 표시하는 setInterval변수
	MODESTATE="defalut", //현제 모드 상태를 담는 변수.
	DIVISION_MENU_JQUERY = $('<span class="division_menu"><span class="icon_area"></span><a></a></span>');
	POSTING_ABLE_ICON_JQUERY = $('<input type="button" class="new_posting_able_icon" value="+"></input>');
	POST_JQUERY = $('<li class="post_head"><span class="icon_area"></span><span class="writer"><a></a></span><span class="title"><a></a></span><span class="reply_num"></span><span class="post_aside time"></span><ul style="display:none"><li class="post_body"></li></ul></li>'),
	HeadLogin = function(){}, //head부분의 login이벤트 함수. login.js에 정의되있다.
	pre_mode = "default",//모드를 원래대로 하기 위한 변수.
	NOW_PAGE = 1,
	SORT_STATE = "seconds",
	setPostData = function(){}; //성능개선을 위해 division.js에서 windowEvent.js로 옮겨서 어쩔수 없이 전역함수화.
/*
	게시물의 목록data를 받아 그것을 html로 변환하는 함수
	add_post.js, divisionMenu.js 에서 사용.
*/
function incodePostListData(data){
	var _ele,
		date = {year:"",month:"",day:"",hour:"",minute:"",second:""},
		result = new Array();

	for(var _i=0, data_len = data.length ; _i < data_len ; _i++){
		_ele = data[_i];
		if(_ele.time != undefined){
			_ele.date = decodeTimestamp(_ele.time);
			_ele.seconds = decodeDataObjSeconds(_ele.date);
		}
		result[_ele.post_index] = _ele;
	}
	return result;
}
function postListGet(data){
	var _ele, //for문에서 사용되는 변수
		title="",
		is_content="",
		result = new Array();
		data_length = data.length;

	for(var _i=0 ; _i < data_length ; _i++){
		_ele = data[_i];
		result[_i] = $(POST_JQUERY).clone();
		if(_ele.reply_num != undefined && _ele.reply_num!=0)
			result[_i].find(".reply_num").text("["+_ele.reply_num+"]");
		console.log(_ele);
		result[_i].attr("name",_ele.post_index).
			data(_ele).
			find(".writer a").text(_ele.writer).end().
			find(".title a").html(_ele.title).end().
			find(".time").attr("title",_ele.time).text(_ele.date.day);
		if(_ele.is_content=="true")
			result[_i].addClass("is_content");
		else if(_ele.reply_num==0 || _ele.reply_num==undefined || _ele.is_content==undefined)
			result[_i].addClass("unopen");

		if(MODESTATE=="post_add")
			result[_i].find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5));
		result[_i] = result[_i][0];
	}
	return result;
}

/*
	timestamp 문자열값을 받아 사용가능한 객체를 반환해주는 함수
*/
function decodeTimestamp(timestamp_data){
	var _date_time = timestamp_data.split(" "),
		_date = _date_time[0].split("-"),
		_time = _date_time[1].split(":");
		time_obj = {
			date: _date_time[0],
			time: _date_time[1],
			year: _date[0],
			month: _date[1],
			day: _date[2],
			hour: _time[0],
			minute: _time[1],
			second: _time[2]
		}
	return time_obj;
}

/*
	decodeTimestamp함수에서 나온 객체값을 받아 초값으로 바꿔주는 함수
*/
function decodeDataObjSeconds(timestampObj){
	var s = parseInt(timestampObj.second,10),
		m =	parseInt(timestampObj.minute*60,10),
		h = parseInt(timestampObj.hour*60*60,10),
		d = parseInt(timestampObj.day*24*60*60,10),
		mo = parseInt(timestampObj.month*2629743,10),
		y = parseInt(timestampObj.year*31556926,10);
	return s+m+h+d+mo+y;
}
function modeChange(mode){
	MODESTATE=mode;
	switch(MODESTATE){
		case "post_add" :
			//$("#division_menu_area").find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5));
			//$("#post_list").find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5));	
			$("#category_menu a").each(function(){
				var $this = $(this),
					data_division_menu = $this.data("division_menu");
				if(data_division_menu!=undefined){
					$(data_division_menu).find("a").each(function(){
						var $this = $(this),
							data_posts = $this.data("posts");
						if(data_posts!=undefined){
							$.each(data_posts,function(){
								$(this).find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5));
							});
						}
					});
					$this.data("division_menu",$(data_division_menu).find(".icon_area").html(POSTING_ABLE_ICON_JQUERY.clone().fadeTo(0,0.5)).end());
				}
			});
			$("#post_list").on("mousemove.post_add.mode",".open",function(e){
				$(this).children(".icon_area").children(".new_posting_able_icon").offset({"top":e.pageY - $(".new_posting_able_icon").height()/2});
			});
			$("new_posting_icon").transition
		break;
		default :
			pre_mode = "default";
			//$("#division_menu_area").find(".icon_area").empty();
			//$("#post_list").find(".icon_area").empty();
			$("#category_menu a").each(function(){
				var $this = $(this),
					data_division_menu = $this.data("division_menu");
				if(data_division_menu!=undefined){
					$(data_division_menu).find("a").each(function(){
						var $this = $(this),
							data_posts = $this.data("posts");
						if(data_posts!=undefined){
							$.each(data_posts,function(){
								$(this).find(".icon_area").empty();
							});
						}
					});
					$this.data("division_menu",$(data_division_menu).find(".icon_area").empty().end());
				}
			});
			$("#post_list").off(".mode");
	}
}


var loginKeep = function(){
	$("#profile progress").val($("#profile progress").val()-1).
		text($("#profile progress").text()-1);
}

var LoginEventAdd = function($id,$pw,$button,loadingFunction,loginSuccess,loginFalse,loading){
	console.log("event_add");
	var id,pw;

	$button.bind("click.login",function() {
		id = $id.val();
		pw = $pw.val();
		$id.add($pw).prop("readonly",true);

		//id와 password 유효성 검사
		if( 6>id.length || 15<id.length || 6>pw.length || 15<pw.length ){
			$id.add($pw).prop("readonly",false);
			$button.prop("disabled",true);
			if( 6>id.length || 15<id.length ){
				miniPopup($id, "id의 길이는 6~15</br>이내여야 합니다.", "id_alram",3000);
				$id.css("background-color","#ff5b60");
			}
			if( 6>pw.length || 15<pw.length ){
				miniPopup($pw, "password의 길이는 6~15</br>이내여야 합니다.", "pw_alram",3000);
				$pw.css("background-color","#ff5b60");
			}
			return;
		}
		
		loadingFunction();

		$.post("./php/login.php",
			{
				user_id:id,
				user_pw:pw
			},function(data,status) {
			
			$id.add($pw).prop("readonly",false);
			
			if(status != "success"){
				miniPopup("html","서버와의 상태가 좋지 않아 로그인에 실패하였습니다. 죄송합니다.","head_alarm",3000,$("#cancel").offset().top,parseInt($("#cancel").offset().left)+100);
				return 0;
			} else {
				if(data)
					loginSuccess();
				else
					loginFalse();
			}
		},"text");
	});
	
	//id와 password 유효성 자동 검사 이벤트.
	$id.add($pw).bind({
		"focusin.login" : function(e) {
			if($(e.target)[0] === $id[0]){
				$id.css("background-color","#ffffff");
				$("#id_alram").fadeIn(300).remove();
			}else if($(e.target)[0] === $pw[0]){
			$pw.css("background-color","#ffffff");
			$("#pw_alram").fadeIn(300).remove();
			}
		},
		"focusout.login" : function(e) {
			id = $id.val();
			pw = $pw.val();
			if($(e.target)[0] === $id[0]){
				if( 6>id.length || 15<id.length ){
					miniPopup($id, "id의 길이는 6~15</br>이내여야 합니다.", "id_alram",3000);
					$id.css("background-color","#ff5b60");
				}
			}else if($(e.target)[0] === $pw[0]){
				if( 6>pw.length || 15<pw.length ){
					miniPopup($pw, "password의 길이는 6~15</br>이내여야 합니다.", "pw_alram",3000);
					$pw.css("background-color","#ff5b60");
				}
			}
		},
		"keyup.login" : function(e) {
			loginButtonChange();
			if(e.which == 13 ) {//enter를 눌렀을시
				$button.trigger("click");
				return;
			}
		}
	})
	function loginButtonChange() {
		id = $id.val();
		pw = $pw.val();
		if( 6>id.length || 15<id.length || 6>pw.length || 15<pw.length )
			$button.prop("disabled",true);
		else
			$button.prop("disabled",false);
	}
}
var LoginEventRemove = function(){

	$("*").unbind(".login");
}

var checkUnload = function(post_add){
	var result = false;
	$(post_add).find(".title textarea").each(function(){
		if($(this).val()!=undefined && $(this).val()!=""){
			result = true;
			return false;
		}
	}).
	end().find(".post_body .content").contents().find("#post_content").each(function(){
		if($(this).text().replace(/\s/g,"")!=undefined && $(this).text().replace(/\s/g,"")!="")
			result = true;
			return false;
	});

	return result;
}

var animationStopToggle = function (){
	var animation = jQuery.fx.off,
		temp_fn = animationStopToggle;
	jQuery.fx.off = true;
	animationStopToggle = function(){
		jQuery.fx.off=animation;
		animationStopToggle = temp_fn;
	}
}


$("*").ajaxStart(function(e){
    $(e.target).addClass("ajax_load");
}).ajaxComplete(function(e){
    $(e.target).removeClass("ajax_load");
}).ajaxError(function(e){
    miniPopup(e.target,"서버와 연결이 되지 않습니다. 이 페이지에서 이전에 본 게시물들의 열람만 가능한 상태입니다.");
});
jQuery(function(){
	POST_ADD_UL = $("#post_add ul").html();
	/*
	reply_add_html = '<li class="post_head post_add reply_add"><span class="writer"><a>'+getCookie("user_nickname")+'</a></span><span class="title"><textarea placeholder="새글 작성. 두번 클릭 또는 Tab키를 누를시 본문작성 가능" rows="1"></textarea></span><ul style="display: none;">'+POST_ADD_UL+'</ul><span class="post_aside"><input type="button" class="post_submit" value="등록"></input></span></li>';
	*/
	if(navigator.appName == "Microsoft Internet Explorer")//브라우져 호환성 유지 
		$(".font-size").load("ieFontSize.htm select");
	$('input, textarea').placeholder();
});
