<?
require_once('../phpInfo/infoDB.php');
$check_nickname = $_GET['check_nickname'];

$query = "SELECT `nickname` FROM memory_user WHERE `nickname`='".$check_nickname."'";
$result = $db->query($query);
//echo $query ;

if(mysqli_num_rows($result)==0){
	echo(true);
}
else{
	echo(false);
}
?>