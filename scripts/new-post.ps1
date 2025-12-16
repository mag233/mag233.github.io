param(
  [Parameter(Mandatory = $false)]
  [string]$Title,

  [Parameter(Mandatory = $false)]
  [string[]]$Categories = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Slugify([string]$s) {
  $s = ($s ?? "").Trim().ToLowerInvariant()
  $s = [Text.RegularExpressions.Regex]::Replace($s, "[^a-z0-9]+", "-")
  $s = [Text.RegularExpressions.Regex]::Replace($s, "^-+|-+$", "")
  if ([string]::IsNullOrWhiteSpace($s)) {
    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    return "post-$stamp"
  }
  return $s
}

if (-not $Title) {
  $Title = Read-Host "Title"
}
if (-not $Categories -or $Categories.Count -eq 0) {
  $catLine = Read-Host "Categories (comma separated, optional)"
  if ($catLine) {
    $Categories = $catLine.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
  } else {
    $Categories = @()
  }
}

$now = Get-Date
$offset = $now.ToString("zzzz").Replace(":", "")
$dateStr = $now.ToString("yyyy-MM-dd HH:mm:ss ") + $offset
$fileDate = $now.ToString("yyyy-MM-dd")
$slug = Slugify $Title
$fileName = "$fileDate-$slug.md"
$postsDir = Join-Path $PSScriptRoot "..\\_posts"
$outPath = Join-Path $postsDir $fileName

$catsJson = ($Categories | ConvertTo-Json -Compress)

$content = @"
---
layout: post
title:  $($Title | ConvertTo-Json -Compress)
date:   $dateStr
categories: $catsJson
---

"@

New-Item -ItemType Directory -Force -Path $postsDir | Out-Null
if (Test-Path $outPath) { throw "File already exists: $outPath" }
$content | Set-Content -Path $outPath -Encoding UTF8

Write-Host "Created: $outPath"
