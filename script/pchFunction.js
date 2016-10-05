function miniPopup(tag, text, id, time, top, left){
	if(!(id))
		id="_mini_popup_temp";
	if($("#"+id).attr("id")){
		$("#"+id).remove();
	}
	var _tag_offset = $(tag).offset(),
		_popup_top,
		_popup_left,
		_popup_style;
	if(top)
		_popup_top = parseInt(top);
	else
		_popup_top = parseInt(_tag_offset.top)+parseInt($(tag).height())/2;
	if(left)
		_popup_left = parseInt(left);
	else
		_popup_left = parseInt(_tag_offset.left)+parseInt($(tag).width())/2;
	_popup_style = "position:absolute; top:"+_popup_top+"px; left:"+_popup_left+"px; background-color:rgba(224,252,129,0.5); -webkit-border-radius:5px 5px 5px 5px;-moz-border-radius:5px 5px 5px 5px; border-radius:5px 5px 5px 5px; padding:5px; z-index:1000;";
	
	$("body").append("<div id='"+id+"' class='mini_popup' style='"+_popup_style+"'>"+text+"</div>");

	if(!(time)){
		time=5000;
	}
	setTimeout("$('#"+id+"').slideUp(500);",time);
	setTimeout("$('#"+id+"').remove();",time+550);

}
function removeArrValue(arr,value){
	var index = arr.indexOf(value);
	if(index == -1)
		return arr;
	if(index == arr.length-1){
		arr.pop();
		return arr;
	}else{
		arr = (arr.slice(0,index)).concat(arr.slice(index+1));
		return arr;
	}
}

function popup(text, title, width, height, top, left, id){

	//이미 존재하는 팝업일시 이전에 존재한 팝업 삭제
	if($("#"+id).attr("id"))
		return;

	//팝업 html에 작성
	$("body").append('<div style="-webkit-border-radius:5px 5px 5px 5px;-moz-border-radius:5px 5px 5px 5px;border-radius:5px 5px 5px 5px;box-shadow: 5px 5px 5px rgba(0,0,0,.5);position:fixed; height:'+height+'; width:'+width+'; top: '+top+'; left: '+left+'; border: 1px solid black; padding: 10px; background-color:rgba(255,255,255,0.7);"><div id="header" style="cursor:move; border-bottom: 5px solid black; height:30px; width:100%; font-family:Arial Black; position:absolute; top:0px; left:0px; vertical-align:middle;"><div id="title" style="height:30px; position:absolute; top:0px; left:20px; line-height:30px;">'+title+'</div><span id="close" style="-webkit-border-radius:100px 0px 0px 100px;-moz-border-radius:100px 0px 0px 100px;border-radius:100px 0px 0px 100px;cursor:pointer; font-family:Arial Black; position:absolute; top:0px; right:0px; border-left:5px solid black; height:30px; width:40px; text-align:center; line-height:30px;">X</span></div><div id="body" scrolling="auto" style="position:absolute; top: 40px; border:0; height:'+(parseInt(height)-40)+'px; width:'+width+';"></div></div>');
	$("#"+id+" #body").append(text);
	
	//팝업 이동을 위한 소스
	$("#"+id+" #header").mousedown(function(e){
		var _click_x = e.pageX,
			_click_y = e.pageY,
			_popup_offset = $("#"+id+" #header").offset();
		$("body").mousemove(function(e){
			var _move_x = _popup_offset.left+(e.pageX-_click_x),
				_move_y = _popup_offset.top+(e.pageY-_click_y);
			$("#"+id).offset({top:_move_y, left:_move_x});
		});
	}).mouseup(function(){
		$("body").unbind('mousemove').unbind('mouseout');
	});

	//팝업 닫기
	$("#"+id+" #close").click(function(){
		$('#'+id).slideUp(500);
		setTimeout("$('#"+id+"').remove();",550);
	}).hover(function(){//닫기 아이콘 효과
		$("#"+id+" #close").css("background", "rgba(255,55,55,0.7)");
	},function(){
		$("#"+id+" #close").css("background", "rgba(255,255,255,0.7)");
	});
};


function setCookie(cName, cValue, cDay){
	var _expire = new Date();
	_expire.setDate(_expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if(typeof cDay != 'undefined') cookies += ';expires=' + _expire.toGMTString() + ';';
	document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
	cName = cName + '=';
	var _cookieData = document.cookie;
	var _start = _cookieData.indexOf(cName);
	var _cValue = '';
	if(_start != -1){
		_start += cName.length;
		var end = _cookieData.indexOf(';', _start);
		if(end == -1)end = _cookieData.length;
		_cValue = _cookieData.substring(_start, end);
	}
		return unescape(_cValue);
}
function rgb2hex(rgb){
 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
 return "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}

$.fn.scrollHeight = function(){
	var $this = $(this);
	if(!($.hasData(this,"scrollHeight_id"))){
		$.data(this,"scrollHeight_id","scrollHeight_"+Math.floor(Math.random() * 10000))
		$("body").append($("<pre id="+$.data(this,"scrollHeight_id")+"></pre>").css({
			"padding":$this.css("padding"),
			"fontSize":$this.css("fontSize"),
			"fontFamily":$this.css("fontFamily"),
			"position":"absolute",
			"top":-1000000,
			"left": -1000000
		}).text($this.val()));
	}
	return $("#"+$.data(this,"scrollHeight_id")).text($this.val()).height();
}
$.fn.hasData = function(data_name){
	return $(this).data(data_name)!=undefined;
}
$.fn.reverse = [].reverse;
$.loadPopup = function(href,op){
	if(op == undefined){
		op={};
	}
	var	top = (op.top==undefined)?100:op.top,
		left = (op.left==undefined)?100:op.left,
		fn = (op.fn==undefined)?function(){}:op.fn,
		id = (op.id==undefined)?"pchFunction_loadPopup":op.id;

	//생성한 팝업[name=popup]을 반환.
	$("<div id='"+id+"' style='display:none; z-index:100000; position:fixed'></div>").appendTo("body");
	$("<div id='pchFunction_temp_load' style='display:none; position:fixed'></div>").appendTo("body");
	$("#"+id).load("popup.htm div[name=popup]",//popup 레이아웃 로드
	function(){
		$("#pchFunction_temp_load").load(href,function(){//세팅
			$("#"+id+" [name=body]").html($("#pchFunction_temp_load [name='body']").html());
			$("#"+id+" [name=title]").text($("#pchFunction_temp_load title").text());
			$("#"+id+" [name=popup]").css({
				"top":top,
				"left":left,
				"height":parseInt($("#pchFunction_temp_load").height())+50,//여분 50
				"width":parseInt($("#pchFunction_temp_load").width())+50,
				"zIndex":999
			}).unwrap().attr("id",id);
			$("#pchFunction_temp_load").remove();
			fn();
		});
		//팝업 이동을 위한 소스
		$("#"+id+" [name=header]").on("mousedown.pchFunction_loadPopup",function(e){
			console.log("mousedown_pch");
			var _click_x = e.pageX,
				_click_y = e.pageY,
				_popup_offset = $("#"+id+" [name=header]").offset();
			$("body").on("mousemove.pchFunction_loadPopup",function(e){
				var _move_x = _popup_offset.left+(e.pageX-_click_x),
					_move_y = _popup_offset.top+(e.pageY-_click_y);
				$("#"+id).offset({top:_move_y, left:_move_x});
			});
		}).mouseup(function(){
			$("body").off('.pchFunction_loadPopup');
		})
	
		//팝업 닫기
		$("#"+id+" [name=close]").on("click.pchFunction_loadPopup",function(){
			$("#"+id+" [name=header]").off('.pchFunction_loadPopup');
			$("#"+id+" [name=close]").off('.pchFunction_loadPopup');
			$('#'+id).slideUp(500,function(){
				$('#'+id).remove();
			});
		}).hover(function(){//닫기버튼 효과
			$("#"+id+" [name=close]").css("background", "rgba(255,55,55,0.7)");
		},function(){
			$("#"+id+" [name=close]").css("background", "rgba(255,255,255,0.7)");
		});
	});
}