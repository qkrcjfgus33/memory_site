<?
session_start();

require_once('../phpJson/JSON.php');

$json = new Services_JSON();

if(!(isset($_SESSION['password_key'],$_SESSION['user_nickname'],$_SESSION['user_id']) && md5($_SESSION['password_key'])==$_COOKIE["2pw_key"])) {
	echo $json->encode("noLogin");
	exit();
}
require_once('../phpInfo/infoDB.php');

$title = preg_replace("/\/\//","&#047;&#047;",preg_replace("/\'/", "&#039;",preg_replace("/\"/", "&#034;",preg_replace("/\&/", "&#038;",preg_replace("/\\n/","<br/>",preg_replace("/\>/","&gt;",preg_replace("/\</","&lt;", $_POST["title"])))))));

$content = $_POST["content"];
if( preg_match("/\S/",strip_tags($content,'<img><video><audio><embed>'))){
	$content = strip_tags($content,'<img><br><u><span><b><a><abbr><acronym><address><basefont><bdi><bdo><article><aside><audio><big><blockquote><caption><center><cite><code><col><colgroup><dfn><dir><div><dl><dt><em><fieldset><figure><font><h1><h2><h3><h4><h5><h6><hgroup><hr><i><ins><kbd><legend><li><map><mark><menu><ol><p><pre><q><s><samp><small><source><strike><strong><sub><summary><sup><table><tbody><td><tfoot><th><thead><time><tr><tt><ul><var><video><wbr><embed>');
	$content = preg_replace("/\\n/","<br/>",preg_replace("/\/\//","&#047;&#047;",preg_replace("/\'/", "&#039;",preg_replace("/\"/", "&#034;", $content))));
}else{
	$content = "";
}

$index = $_POST["choes_index"];
$type = $_POST["type"];

if(!(filter_var($index, FILTER_VALIDATE_INT))){
	echo $json->encode("upload_false1");
	exit();
}
if(!($type=='post' || $type=='reply')){
	echo $json->encode("upload_false2");
	exit();
}

//모든 제목과 내용 작성여부 및 데이터 검사(해킹검사) 소스 추가 필요

$query = "INSERT INTO `memory_post` (`index`, `menu_index`, `writer`, `title`, `time`,`type`) VALUES (NULL, '".$index."', '".$_SESSION['user_index']."', '".$title."', CURRENT_TIMESTAMP,'".$type."');";
if($content!=""){
	$query .=("INSERT INTO `memory_content` (`index`, `content`) VALUES (LAST_INSERT_ID(), '".$content."');");
}

$result = mysqli_multi_query($db,$query);

$num = 0;
while(!($result)){
	if($num>5){
		echo("upload_false3");
		exit();
	}
	$num++;
	$result = mysqli_multi_query($db,$query);
}

echo("true");
exit();
?>