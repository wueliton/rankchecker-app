<?php

namespace RankChecker;

use DOMDocument;

class FindKeyWordInGoogle
{
  private string $baseURL;
  private int $maxPageSearch;
  private string $keyword;
  private string $website;
  private array $pagesArrayBase;

  public function __construct(string $keyword, string $website, $maxPageSearch = 5, $baseURL = 'https://www.google.com/search?q=')
  {
    $this->keyword = $keyword;
    $this->website = $website;
    $this->maxPageSearch = $maxPageSearch;
    $this->baseURL = $baseURL;
    $this->pagesArrayBase = array_fill(0, $this->maxPageSearch, null);
  }

  public function runSearch()
  {
    set_time_limit(0);
    $keywordsList = $this->generatePages($this->keyword);
    $searchResult = null;

    foreach ($keywordsList as $index => $keyword) {
      sleep(10);
      $result = $this->getKeyWordPosition($keyword['url'], $keyword['keyword'], $this->website, $keyword['page']);

      if ($result === 'recaptcha') {
        $searchResult = 'recaptcha';
        break;
      }

      if (!empty($result)) {
        $searchResult = $result;
        break;
      }
    }

    if (empty($searchResult)) return [
      "title" => null, "link" => null,
      "keyword" => $this->keyword, "url" => null,
      "page" => null, "position" => null
    ];

    return $searchResult;
  }

  private function generatePages(string $keyword)
  {
    $keywordsList = [];

    foreach ($this->pagesArrayBase as $key => $value) {
      array_push(
        $keywordsList,
        [
          "keyword" => $keyword,
          "url" => $this->baseURL . urlencode($keyword) . '&start=' . ($key * 10),
          "page" => $key + 1
        ]
      );
    }

    return $keywordsList;
  }

  private function getKeyWordPosition(string $url, $keyword, $website, $page)
  {
    $content = $this->getPageContent($url);
    $document = new DOMDocument();
    libxml_use_internal_errors(true);
    $document->loadHTML($content);
    libxml_clear_errors();
    $links = $document->getElementsByTagName('a');
    $titles = array();
    $pos = [];
    preg_match('/g-recaptcha/i', $content, $recaptcha);

    if (!empty($recaptcha)) {
      return 'recaptcha';
    }

    foreach ($links as $link) {
      $title = $link->getElementsByTagName('h3');
      $href = $link->getAttribute('href');

      if ($title->length > 0 && !str_contains($href, '/search?')) {
        $newArray = [
          "title" => $title->item(0)->nodeValue,
          "link" => $href,
        ];
        array_push($titles, $newArray);
      }
    };

    foreach ($titles as $key => $title) {
      if (str_contains($title['link'], $website)) {
        $pos = [...$title, "keyword" => $keyword, "url" => $url, "position" => $key + 1, "page" => $page];
        break;
      }
    }

    if (!empty($pos)) {

      if (!is_dir("reports/{$this->website}/")) {
        mkdir("reports/{$this->website}/", 0777, true);
      }

      $searchName = $this->sanitizeString($keyword);
      $contentFile = str_replace('src="/', 'src="https://www.google.com/', $content);
      $contentFile = str_replace('style="background:url(/images', 'style="background:url(https://www.google.com/images', $contentFile);
      file_put_contents("reports/{$website}/" . $searchName . ".html", $contentFile);

      return $pos;
    }

    return null;
  }

  private function getPageContent(string $url)
  {
    $ch = curl_init($url);
    curl_setopt_array($ch, array(
      CURLOPT_CUSTOMREQUEST       => "GET",
      CURLOPT_POST                => false,
      CURLOPT_COOKIEFILE          => "cookie.txt",
      CURLOPT_COOKIEJAR           => "cookie.txt",
      CURLOPT_USERAGENT           => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3694.0 Safari/537.36 Chrome-Lighthouse',
      CURLOPT_URL                 => $url,
      CURLOPT_HEADER              => false,
      CURLOPT_FOLLOWLOCATION      => true,
      CURLOPT_ENCODING            => 'UTF-8',
      CURLOPT_VERBOSE             => true,
      CURLOPT_AUTOREFERER         => true,
      CURLOPT_RETURNTRANSFER      => true,
      CURLOPT_SSL_VERIFYPEER      => false,
      CURLOPT_CONNECTTIMEOUT      => 120,
      CURLOPT_TIMEOUT             => '10',
    ));

    $content = curl_exec($ch);
    curl_close($ch);

    return $content;
  }

  private function sanitizeString($str)
  {
    $str = preg_replace('/[áàãâä]/ui', 'a', $str);
    $str = preg_replace('/[éèêë]/ui', 'e', $str);
    $str = preg_replace('/[íìîï]/ui', 'i', $str);
    $str = preg_replace('/[óòõôö]/ui', 'o', $str);
    $str = preg_replace('/[úùûü]/ui', 'u', $str);
    $str = preg_replace('/[ç]/ui', 'c', $str);
    $str = preg_replace('/[^a-z0-9]/i', '_', $str);
    $str = preg_replace('/_+/', '_', $str);
    $str = strtolower($str);
    return $str;
  }
}
