<?
session_start();
$login=false;
if( isset($_COOKIE["2pw_key"],$_COOKIE["user_nickname"]) && isset($_SESSION['password_key'],$_SESSION['user_nickname'],$_SESSION['user_id']) && md5($_SESSION['password_key'])==$_COOKIE["2pw_key"] ){
	setcookie('2pw_key',$_COOKIE["2pw_key"],time()+60*60*24,"/");
	setcookie('user_nickname',$_COOKIE["user_nickname"],time()+60*60*24,"/");
	$_SESSION['password_key'] = $_SESSION['password_key'];
	$_SESSION['user_nickname'] = $_SESSION['user_nickname'];
	$_SESSION['user_id'] = $_SESSION['user_id'];
	$_SESSION['password_key'] = $_SESSION['password_key'];
	$login=true;
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="UTF-8">

	<link rel="stylesheet" href="font/font.css">

	<link rel="stylesheet" href="css/layout.css">
	<link rel="stylesheet" href="css/header.css">
	<link rel="stylesheet" href="css/footer.css">
	<link rel="stylesheet" href="css/divisionMenu.css">
	<link rel="stylesheet" href="css/postAdd.css">
	<link rel="stylesheet" href="css/categoryMenu.css">
	<link rel="stylesheet" href="css/postList.css">
	<link rel="stylesheet" href="css/alarmField.css">
	<link rel="stylesheet" href="css/postEdit.css">
	<link rel="stylesheet" href="css/miniIconBox.css">
	<link rel="stylesheet" href="css/ajax.css">

	<link rel="stylesheet" href="jquery/poshytip-master/src/tip-yellowsimple/tip-yellowsimple.css">
	<link rel="stylesheet" href="jquery/poshytip-master/src/tip-yellow/tip-yellow.css">
	
	
	<script src="jquery/jquery-1.8.2.min.js"></script>
	<script src="jquery/jquery.easing.1.3.js"></script>
	<script src="jquery/jquery.placeholder.min.js"></script>
	<script src="jquery/jquery.transit.min.js"></script>
	<script src="jquery/poshytip-master/src/jquery.poshytip.min.js"></script>

	
	<script src="script/pchFunction.js"></script>
	<script src="script/global.js"></script>
	
	<script src="script/headerAnimation.js"></script>
	<script src="script/categoryMenu.js"></script>
	<script src="script/divisionMenu.js"></script>
	<script src="script/login.js"></script>
	<script src="script/logout.js"></script>
	<script src="script/register.js"></script>
	<script src="script/postAdd.js"></script>
	<script src="script/postEditer.js"></script>
	<script src="script/appArea.js"></script>

	<script src="script/windowEvent.js"></script>

	<title> Memory </title>
</head>
<body>

	<header>
		<nav id="header_nav">
			<img id="logo" class="logo" src="logo.png">
			<div id="profile" class="profile">
			<?

			if(!($login)) {
				?>
				<label for='id'>ID: <input type='text' size='15' id='id'></label>
				<label for='pw'>Password: <input type='password' size='15' id='pw'></label>
				<input type='button' value='Login' id='login' disabled="true">
				<input type='button' value='Register' id='register'>
				<?
			} else{
				$now = date( "Y-m-d H:i:s", time()); // 현재시각
				list($day,$time) = split(" ",$now); // 날짜와 시간으로 쪼개고..
				list($Y,$m,$d) = split("-",$day); // 날짜는 다시 년,월,일 로 쪼개고..
				list($H,$i,$s) = split(":",$time); // 시간은 다시 시,분,초 로 쪼개고..
				$d_day = date( "Y-m-d H:i:s", mktime( $H, $i, $s+60*60*24, $m, $d, $Y));
				echo("<img src='profile.jpg' id='profile_img'>");
				echo("<div id='nick_name'> ".$_COOKIE['user_nickname']."</div>");
				echo("<input type='button' value='Logout' id='logout'>");
				echo("<meter value='24' low='1' max='24' title = '".$d_day."에 로그아웃 됩니다.'>24</meter>");
			}
			?>
			</div>
			<div id="app"><input type="button" id="ainmation_state_change" value="Ain OFF"></input></div>
		</nav>
		<aside id="alarm_field" style="display:none">
			<div id="alarm">알람</div>
			<div id="switch"></div>
		</aside>
	</header>
	
	
	<nav id="division_menu_area">
	</nav>
	<nav id="category_menu">
	</nav>
	
	<selection class="post_list_box" id="post_list_box" >
		<ul id="post_list" class="post_list">
			<li id="post_add" class="post_head post_add">
				<!--	
				<span class="writer"><a><?echo $_COOKIE['user_nickname']?></a></span>
				-->
				<span class="title">
					<textarea placeholder="새글 작성." rows="1" title = "두번 클릭 또는 Tab키를 누를시 본문작성 가능"></textarea>
				</span>
				
				<ul style="display:none;">
					<li class="post_editer">
						<span class="FontName">
							<select>
								<option value="Dotum,돋움">돋움</option>
								<option value="DotumChe,돋움체">돋움체</option>
								<option value="Gulim,굴림">굴림</option>
								<option value="GulimChe,굴림체">굴림체</option>
								<option value="Batang,바탕">바탕</option>
								<option value="BatangChe,바탕체">바탕체</option>
								<option value="Gungsuh,궁서">궁서</option>
								<option value="GungsuhChe,궁서체">궁서체</option>
								<option value="Malgun Gothic,맑은 고딕">맑은 고딕</option>
							</select>
						</span>
						<span class="font-size">
						<input type="number" value="16" min="3" max="200" ></input>pt
						
						</span>
						<span class="font-design">
							<input type="checkbox" class="checked" value="bold" id="bold" style="display:none;"></input><label for="bold"><b>가</b></label>
							<input type="checkbox" value="italic" id="italic" style="display:none;"></input><label for="italic"><i>가</i></label>
							<input type="checkbox" value="Underline" id="Underline" style="display:none;"></input><a><label for="Underline"><u>가</u></label></a>
						</span>
						<span class="ForeColor">
							<input type="color"></input>
						</span>
						<span class="justify">
							<select>
								<option value="justifyleft">왼쪽</option>
								<option value="justifycenter">가운데</option>
								<option value="justifyright">오른쪽</option>
								<option value="justifyfull">양쪽</option>
							</select>
						</span>정렬

						
					</li>
					<div class="incode_html" style="text-align: right;">
						html<input type="checkbox"></input>
					</div>
					<li class="post_body">
						<iframe class="content" src="postBody.htm"></iframe>
					</li>
				</ul>
			</li>
		</ul>
		
	</selection>
	<footer>
	
	</footer>
	<selection class="mini_icon_box">
		<input type="image" src="img\postAdd.png" id="new_posting_icon" class="new_posting_icon">

		<input type="button" value="+" id="all_post_open" class="all_post_open">
		<input type="button" value="-" id="all_post_close" class="all_post_close">
			<!--
		<input type="button" value="↑" id="page_up" class="page_move">
		<input type="button" value="↓" id="page_down" class="page_move">
		<input type="button" value="01" id="page_number" class="page_move">
-->
		<input type="button" value="＊" id="mode_change_icon" class="mode_change_icon">
		<input type="button" value="▲" id="scroll_up_icon" disabled class="scroll_up_icon">
	</selection>
	<selection class="chat_box">
	</selection>
	
	<selection class="navi_box">
	</selection>
	
	<div id="lab"></div>
	<div id="lab_body"></div>


	
</body>
</html>
