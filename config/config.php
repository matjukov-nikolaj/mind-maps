<?php
$container->loadFromExtension('doctrine', array(
    'dbal' => array(
        'driver'   => 'pdo_mysql',
        'host'     => '%database_host%',
        'dbname'   => '%database_name%',
        'user'     => '%database_user%',
        'password' => '%database_password%',
    ),
));
