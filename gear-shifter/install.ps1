# Antigravity 流体挡位调节器 — 一键安装脚本 (支持 app.asar 与 workbench.html)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PatchScript = Join-Path $ScriptDir "patch-asar.mjs"
$JsSource = Join-Path $ScriptDir "src\antigravity-gear-shifter.js"

$CandidateRoots = @(
    "$env:LOCALAPPDATA\Programs\antigravity",
    "$env:LOCALAPPDATA\Programs\Antigravity",
    "$env:ProgramFiles\Antigravity",
    "${env:ProgramFiles(x86)}\Antigravity"
)

# 1. 优先检测 Antigravity 2.0 (Electron app.asar)
$AsarFiles = @()
foreach ($Root in $CandidateRoots) {
    $Asar = Join-Path $Root "resources\app.asar"
    if (Test-Path $Asar) {
        $AsarFiles += $Asar
    }
}
$AsarFiles = $AsarFiles | Select-Object -Unique

if ($AsarFiles.Count -gt 0) {
    $NodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if (-not $NodeCmd) {
        Write-Host "[错误] 需要 Node.js 来解包并注入 app.asar。" -ForegroundColor Red
        exit 1
    }
    foreach ($Asar in $AsarFiles) {
        Write-Host "[注入] 检测到 Antigravity app.asar -> $Asar" -ForegroundColor Cyan
        & node $PatchScript install $Asar
    }
    Write-Host "`n安装完成！请完全退出并重启 Antigravity，即可在【模型选择】右侧看到流体挡位插件。" -ForegroundColor Green
    exit 0
}

# 2. 回退检测 IDE 模式 (workbench.html)
$WorkbenchFiles = @()
foreach ($Root in $CandidateRoots) {
    if (Test-Path $Root) {
        $Found = Get-ChildItem -Path $Root -Filter "workbench*.html" -Recurse -ErrorAction SilentlyContinue
        if ($Found) { $WorkbenchFiles += $Found }
    }
}

if ($WorkbenchFiles.Count -eq 0) {
    Write-Host "[提示] 未在默认路径检测到 app.asar 或 workbench.html，请手动执行：" -ForegroundColor Yellow
    Write-Host "  node `"$PatchScript`" install `"你的Antigravity路径\resources\app.asar`"" -ForegroundColor Cyan
    exit 1
}

foreach ($HtmlFile in $WorkbenchFiles) {
    $TargetDir = $HtmlFile.DirectoryName
    $CopiedJs = Join-Path $TargetDir "antigravity-gear-shifter.js"
    $BackupHtml = "$($HtmlFile.FullName).gear-bak"

    if (-not (Test-Path $BackupHtml)) {
        Copy-Item $HtmlFile.FullName $BackupHtml -Force
    }
    Copy-Item $JsSource $CopiedJs -Force

    $Content = Get-Content $HtmlFile.FullName -Raw -Encoding UTF8
    $Tag = '<script src="antigravity-gear-shifter.js"></script>'
    if ($Content -notmatch "antigravity-gear-shifter\.js") {
        $Content = $Content -replace "</html>", "  $Tag`r`n</html>"
        Set-Content -Path $HtmlFile.FullName -Value $Content -Encoding UTF8
    }
    Write-Host "[成功] 已注入: $($HtmlFile.FullName)" -ForegroundColor Green
}
