<?
require_once('../phpInfo/infoDB.php');
$register_id = $_POST['register_id'];
$register_pw = $_POST['register_pw'];
$register_nickname = $_POST['register_nickname'];

if(preg_match("/^[\wㄱ-ㅎㅏ-ㅣ가-힣]{6,15}$/",$register_id)==0){
	echo("장난치지 마세요");
	$success = false;
	exit();
}
if(preg_match("/^[\wㄱ-ㅎㅏ-ㅣ가-힣]{6,15}$/",$register_pw)==0){
	echo("장난치지 마세요");
	$success = false;
	exit();
}
if(preg_match("/^[\wㄱ-ㅎㅏ-ㅣ가-힣]{1,10}$/",$register_nickname)==0){
	echo("장난치지 마세요");
	$success = false;
	exit();
}

$query = "SELECT `id` FROM memory_user WHERE `id`='".$register_id."'";
$result = $db->query($query);

$success = true;

if(!(mysqli_num_rows($result)==0)){
	echo("중복된 아이디가 있습니다. ");
	$success = false;
}

$query = "SELECT `nickname` FROM memory_user WHERE `nickname`='".$register_nickname."'";
$result = $db->query($query);

if(!(mysqli_num_rows($result)==0)){
	echo("중복된 닉네임이 있습니다.");
	$success = false;
}

if($success){
	$query = "INSERT INTO memory_user (`id`, `password`, `nickname`) VALUES ('".$register_id."', MD5('".$register_pw."'), '".$register_nickname."')";
	$result = $db->query($query);
	echo("success");
}

?>