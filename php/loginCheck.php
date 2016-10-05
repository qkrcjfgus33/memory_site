<?
if(!(isset($_SESSION['password_key'],$_SESSION['user_nickname'],$_SESSION['user_id'],$_SESSION['user_index']) && md5($_SESSION['password_key'])==$_COOKIE["2pw_key"] )){
	echo "xxxxxxx";
	exit();
}
?>