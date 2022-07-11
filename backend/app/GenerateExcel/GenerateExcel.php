<?php

namespace RankCheckerExcel;

use Shuchkin\SimpleXLSXGen;

class GenerateExcel
{
  private array $keywords;
  private string $client;
  private string $website;

  public function __construct(array $keywords, string $client, string $website)
  {
    $this->keywords = $keywords;
    $this->client = $client;
    $this->website = $website;
  }

  public function generate()
  {
    $today = date("d/m/Y");

    $keywordsReport = [];

    foreach ($this->keywords as $keyword) {
      array_push($keywordsReport, [
        empty($keyword['url']) ? $keyword['keyword'] : '<a href="' . $keyword['url'] . '">' . $keyword['keyword'] . '</a>',
        $keyword['position'], $keyword['page'],
        is_null($keyword['position']) ? 'Não encontrado' : 'Encontrada'
      ]);
    };

    $data = [
      ["<center>Relatório {$this->client}</center>"],
      ['Gerado em', '', $today],
      ['', ''],
      ['Palavra-chave', 'Posição', 'Página', 'Status'],
      ...$keywordsReport
    ];
    $xlsx = SimpleXLSXGen::fromArray($data, "Relatório {$this->client}")
      ->setDefaultFont('Segoe UI')
      ->setDefaultFontSize(14)
      ->mergeCells('A1:D1')
      ->mergeCells('A2:B2')
      ->mergeCells('C2:D2');
    return $xlsx->downloadAs("Reporte {$this->client} - {$today}.xlsx");
  }
}
