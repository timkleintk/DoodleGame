<?php
echo 'getting the latest files...';
echo (system("git pull"));

header('Location: index.html');
?>