<?php

namespace RankCheckerExcel;

use PhpOffice\PhpSpreadsheet\IOFactory;

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

    $data = [
      ["Relatório {$this->client}"],
      ["Gerado em: " . $today],
      ['', ''],
      ['', 'Palavra-chave', 'Página', 'Posição', 'Status'],
    ];

    $spreadsheet = IOFactory::load('./report.xlsx');
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray($data, NULL, 'A2');

    $cell = 6;

    $hyperlinkStyle = array(
      'font' => array(
        'color' => array('rgb' => '015493'),
        'text-style' => 'underline'
      )
    );

    foreach ($this->keywords as $keyword) {
      $sheet->setCellValue("A{$cell}", $keyword['id']);
      $sheet->setCellValue("B{$cell}", $keyword['keyword']);
      if (!empty($keyword['url'])) {
        $sheet->getCell("B{$cell}")->getHyperlink()->setUrl($keyword['url']);
        $sheet->getStyle("B{$cell}")->applyFromArray($hyperlinkStyle);
      }
      $sheet->setCellValue("C{$cell}", $keyword['page']);
      $sheet->setCellValue("D{$cell}", $keyword['position']);
      $sheet->setCellValue("E{$cell}", is_null($keyword['position']) ? 'Não encontrado' : 'Encontrada');
      $cell = $cell + 1;
    };

    $sheet->mergeCells('A2:E2');
    $sheet->mergeCells('A3:B3');
    $sheet->getStyle('A2:E2')->getAlignment()->setHorizontal("center");

    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save('php://output');
    exit;
  }
}
