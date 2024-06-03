<?php
$now_hash = hash( 'sha256', date('U') );
//var_dump( '<pre>', $now_hash, '</pre>' );
?>
<html>
<title></title>
<body>
<pre><?php
echo $now_hash;
?></pre>
</body>
</html>