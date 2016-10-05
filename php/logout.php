<?
session_start();
require_once('../phpInfo/infoDB.php');

session_unset("user_id");
session_unset("user_index");
session_unset("user_nickname");
session_unset("password_key");

unset($_COOKIE);
echo $_COOKIE["2pw_key"];
echo $_COOKIE["user_nickname"];
?>