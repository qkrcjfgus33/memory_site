<?
session_start();
require_once('../phpInfo/infoDB.php');
$user_id = $_POST['user_id'];
$user_pw = $_POST['user_pw'];

$query = "SELECT `index`,`nickname`,`id` FROM memory_user WHERE `id`='".$user_id."' AND `password`='".md5($user_pw)."'";
$result = $db->query($query);
//echo $query ;

if(mysqli_num_rows($result)==1){
	$randkey = mt_rand();
	$result_arr = $result->fetch_assoc();
	setcookie('2pw_key',md5($randkey),time()+60*60*24,"/"); //랜덤키값의 암호화된 값을 넣자.
	setcookie('user_nickname',$result_arr['nickname'],time()+60*60*24,"/");
	$_SESSION['user_id']=$result_arr['id'];
	$_SESSION['user_index']=$result_arr['index'];
	$_SESSION['user_nickname']=$result_arr['nickname'];
	$_SESSION['password_key']=$randkey; // 이것을 다음값에 넘김뒤 그곳에서 암호화시킨다.
	//쿠키에는 랜덤값의 암호화된값. 세션에는 본래의 랜덤값을 넣은뒤 로그인창에서 세션값을 암호화시켜 일치되는지 이용된다.(동일해야함 즉..)
	echo(true);
}
else{
	echo(false);
}
/*
나중에 비밀번호 보안문제는 변경하자!
*/
?>