# 홈페이지 커밋·푸시 한 번에 실행
#   사용법:  .\push.ps1               (자동 메시지)
#           .\push.ps1 "커밋 메시지"
Set-Location $PSScriptRoot

$Message = if ($args.Count -gt 0) { $args -join " " } else { "Update site ($(Get-Date -Format 'yyyy-MM-dd HH:mm'))" }

git add -A
$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "변경 사항이 없습니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "커밋할 파일:" -ForegroundColor Cyan
$staged | ForEach-Object { Write-Host "  $_" }

git commit -m $Message
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "push 거절됨 → git pull --rebase 후 재시도" -ForegroundColor Yellow
    git pull --rebase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "충돌이 발생했습니다. 수동으로 확인해 주세요." -ForegroundColor Red
        exit 1
    }
    git push
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "완료 — https://hpic-lab.github.io (1~2분 후 반영, 하드 리프레시 Ctrl+Shift+R)" -ForegroundColor Green
} else {
    Write-Host "push 실패. 오류 메시지를 확인해 주세요." -ForegroundColor Red
    exit 1
}
