<?php

header("Access-Control-Allow-Origin: *");

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use RankChecker\FindKeyWordInGoogle;
use RankCheckerExcel\GenerateExcel;

require __DIR__ . '/vendor/autoload.php';

date_default_timezone_set("UTC");

$app = AppFactory::create();

$app->addBodyParsingMiddleware();

$app->addRoutingMiddleware();

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->post('/search', function (Request $request, Response $response, $args) {
    $data = $request->getParsedBody();

    if (empty($data['website']) || empty($data['client']) || empty($data['keyword'])) {
        $payload = json_encode(["error" => ["message" => "Dados incompletos"]]);
        $response->getBody()->write($payload);
        return $response->withStatus(401);
    }

    $rank = new FindKeyWordInGoogle($data['keyword'], $data['website']);
    $result = $rank->runSearch();
    $payload = json_encode($result);

    $response->getBody()->write($payload);
    return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
});

$app->post('/generate-excel', function (Request $request, Response $response, $args) {
    $data = $request->getParsedBody();

    if (empty($data['website'] || empty($data['client']) || empty($data['keywords']))) {
        $payload = json_encode(["error" => ["message" => "Dados incompletos"]]);
        $response->getBody()->write($payload);
        return $response->withStatus(401);
    }

    $file = new GenerateExcel($data['keywords'], $data['client'], $data['website']);
    return $file->generate();
});

$app->run();
