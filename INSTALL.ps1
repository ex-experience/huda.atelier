Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $here 'huda.atelier'
$dest = Join-Path $env:USERPROFILE 'huda.atelier'
$repoUrl = 'https://github.com/ex-experience/huda.atelier.git'
if (Test-Path (Join-Path $dest '.git')) {
  Set-Location $dest
  git pull origin main
} else {
  git clone $repoUrl $dest
  Set-Location $dest
}
Copy-Item -Path (Join-Path $src '*') -Destination $dest -Recurse -Force
git add -A
git status --short
git commit -m "V6 complete package"
git push origin main
Write-Host "https://ex-experience.github.io/huda.atelier/"
