#!/usr/bin/env php
<?php
$testNumber = 20000;
$groupNumber = 100;
$configFile = __DIR__ . '/config.json';
$methods = array('GET', 'POST');
$config = array(
    'tests' => array(),
    'env' => array('base_url' => 'http://localhost/api/'),
);

for ($i = 1; $i <= $testNumber; $i++) {
    $params = array();
    for ($j = 1; $j <= rand(1, 5); $j++) {
        $params['key_' . $j] = 'value_' . $j;
    }

    $test = array(
        'group' => 'group_' . rand(1, $groupNumber),
        'name' => 'test_' . $i,
        'desc' => 'description_' . $i,
        'method' => $methods[rand(0, count($methods) -1)],
        'url' => '{base_url}/url_' . $i,
        'params' => $params
    );

    $config['tests'][] = $test;
}

file_put_contents($configFile, json_encode($config));

