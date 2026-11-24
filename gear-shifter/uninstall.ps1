# Antigravity 流体挡位调节器 — 一键卸载与还原脚本

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PatchScript = Join-Path $ScriptDir "patch-asar.mjs"

$CandidateRoots = @(
    "$env:LOCALAPPDATA\Programs\antigravity",
    "$env:LOCALAPPDATA\Programs\Antigravity",
    "$env:ProgramFiles\Antigravity",
    "${env:ProgramFiles(x86)}\Antigravity"
)

foreach ($Root in $CandidateRoots) {
    $Asar = Join-Path $Root "resources\app.asar"
    if (Test-Path $Asar) {
        & node $PatchScript uninstall $Asar
    }
    if (Test-Path $Root) {
        $Backups = Get-ChildItem -Path $Root -Filter "workbench*.html.gear-bak" -Recurse -ErrorAction SilentlyContinue
        foreach ($Bak in $Backups) {
            $OrigHtml = $Bak.FullName -replace "\.gear-bak$", ""
            Copy-Item $Bak.FullName $OrigHtml -Force
            Remove-Item $Bak.FullName -Force
            $InjectedJs = Join-Path $Bak.DirectoryName "antigravity-gear-shifter.js"
            if (Test-Path $InjectedJs) { Remove-Item $InjectedJs -Force }
            Write-Host "[已还原] $OrigHtml" -ForegroundColor Green
        }
    }
}

Write-Host "卸载完成，重启 Antigravity 即可恢复原始界面。" -ForegroundColor Cyan
