[CmdletBinding()]
param(
    [string]$BackendPath = '',
    [switch]$Setup,
    [switch]$TestSms,
    [switch]$SeedNox
)
$ErrorActionPreference = 'Stop'
$frontendRoot = Split-Path -Parent $PSScriptRoot
if (-not $BackendPath) { $BackendPath = Join-Path (Split-Path -Parent $frontendRoot) 'backend' }
$backendRoot = (Resolve-Path -LiteralPath $BackendPath).Path
if (-not (Test-Path (Join-Path $backendRoot 'artisan'))) { throw 'BackendPath must be the NOX Laravel backend folder.' }
$phpCommand = (Get-Command php -ErrorAction Stop).Source
$npmCommand = (Get-Command npm.cmd -ErrorAction Stop).Source
$composerCommand = Get-Command composer -ErrorAction Stop
$backendEnv = Join-Path $backendRoot '.env'
if (-not (Test-Path -LiteralPath $backendEnv)) {
    throw 'NOX backend .env is missing. Copy .env.example to .env and enter your NOX database credentials first. Do not copy the LBB .env.'
}
$environmentText = [IO.File]::ReadAllText($backendEnv)
function Read-EnvValue([string]$Text, [string]$Name) {
    $found = [regex]::Match($Text, '(?m)^' + [regex]::Escape($Name) + '\s*=\s*(.*?)\s*$')
    if (-not $found.Success) { return '' }
    return $found.Groups[1].Value.Trim().Trim('"').Trim("'")
}
if ((Read-EnvValue $environmentText 'APP_ENV') -ne 'local') { throw 'This launcher only runs a backend with APP_ENV=local. No settings were changed.' }
$databaseName = Read-EnvValue $environmentText 'DB_DATABASE'
if ((Read-EnvValue $environmentText 'DB_CONNECTION') -ne 'mysql' -or $databaseName -ne 'nox') {
    throw 'Expected the existing local MySQL database named nox. No database was created or reset. Verify the NOX .env before continuing.'
}
function Write-EnvValues([string]$Path, [hashtable]$Values) {
    $text = if (Test-Path -LiteralPath $Path) { [IO.File]::ReadAllText($Path) } else { '' }
    foreach ($name in $Values.Keys) {
        $value = [string]$Values[$name]
        if ($value -match '[\r\n]') { throw 'Invalid environment value.' }
        $line = $name + '="' + $value.Replace('\', '\\').Replace('"', '\"').Replace('$', '\$') + '"'
        $pattern = '(?m)^' + [regex]::Escape($name) + '\s*=.*$'
        if ([regex]::IsMatch($text, $pattern)) {
            $replacement = $line
            $text = [regex]::Replace($text, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacement })
        } else { $text = $text.TrimEnd() + "`r`n" + $line + "`r`n" }
    }
    [IO.File]::WriteAllText($Path, $text, (New-Object Text.UTF8Encoding $false))
}
function Invoke-Checked([string]$WorkingDirectory, [string]$Executable, [string[]]$CommandArguments) {
    Push-Location -LiteralPath $WorkingDirectory
    try {
        & $Executable @CommandArguments
        if ($LASTEXITCODE -ne 0) { throw "Command failed: $Executable $($CommandArguments -join ' ')" }
    } finally { Pop-Location }
}
foreach ($port in @(5173, 8000)) {
    $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listeners) { throw "Port $port is already in use. Stop the previous NOX terminal if it owns this port, then retry. Nothing was killed." }
}
$backupDirectory = Join-Path $backendRoot 'storage/app/private/nox-local'
New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null
Copy-Item -LiteralPath $backendEnv -Destination (Join-Path $backupDirectory ('env-' + [guid]::NewGuid().ToString('N') + '.backup'))
$backendValues = @{
    APP_URL='http://127.0.0.1:8000'; FRONTEND_URL='http://127.0.0.1:5173';
    FRONTEND_URLS='http://127.0.0.1:5173,http://localhost:5173';
    SANCTUM_STATEFUL_DOMAINS='127.0.0.1:5173,localhost:5173';
    SESSION_DOMAIN=''; SESSION_SECURE_COOKIE='false'; SESSION_SAME_SITE='lax';
    PAYMENT_CALLBACK_URL='http://127.0.0.1:5173/payment/result'
}
if ($TestSms) {
    $backendValues.SMS_PROVIDER='testing'
    $backendValues.OTP_EXPOSE_TEST_CODE='true'
    Write-Host 'Local test OTP enabled. No Kavenegar message will be sent. Payment settings are unchanged.'
}
Write-EnvValues $backendEnv $backendValues
Write-EnvValues (Join-Path $frontendRoot '.env.local') @{
    VITE_SITE_URL='http://127.0.0.1:5173'; VITE_NOX_BACKEND_MODE='live';
    VITE_NOX_API_BASE_URL='http://127.0.0.1:8000';
    VITE_LBB_BACKEND_MODE='live'; VITE_LBB_API_BASE_URL='http://127.0.0.1:8000'
}
if ($Setup) {
    Invoke-Checked $backendRoot $composerCommand.Source @('install', '--prefer-dist', '--no-interaction')
    Invoke-Checked $frontendRoot $npmCommand @('ci', '--no-audit', '--no-fund')
} elseif (-not (Test-Path (Join-Path $backendRoot 'vendor/autoload.php')) -or -not (Test-Path (Join-Path $frontendRoot 'node_modules'))) {
    throw 'Dependencies are missing. Re-run with -Setup.'
}
Invoke-Checked $backendRoot $phpCommand @('artisan', 'config:clear')
if (-not (Read-EnvValue $environmentText 'APP_KEY')) {
    Invoke-Checked $backendRoot $phpCommand @('artisan', 'key:generate')
}
if ($Setup) { Invoke-Checked $backendRoot $phpCommand @('artisan', 'migrate', '--no-interaction') }
else { Invoke-Checked $backendRoot $phpCommand @('artisan', 'migrate:status') }
if ($SeedNox) {
    Invoke-Checked $backendRoot $phpCommand @('artisan', 'db:seed', '--class=NoxBrandFoundationSeeder')
    Invoke-Checked $backendRoot $phpCommand @('artisan', 'db:seed', '--class=NoxSampleProductSeeder')
}
if (-not (Test-Path (Join-Path $backendRoot 'public/storage'))) {
    Invoke-Checked $backendRoot $phpCommand @('artisan', 'storage:link')
}
function Start-NoxTerminal([string]$Directory, [string]$Executable, [string]$ArgumentsText) {
    $code = "Set-Location -LiteralPath '" + $Directory.Replace("'", "''") + "'; & '" + $Executable.Replace("'", "''") + "' " + $ArgumentsText
    $encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($code))
    Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoExit', '-NoProfile', '-EncodedCommand', $encoded) -PassThru
}
$backendProcess = Start-NoxTerminal $backendRoot $phpCommand 'artisan serve --host=127.0.0.1 --port=8000'
$frontendProcess = Start-NoxTerminal $frontendRoot $npmCommand 'run dev -- --host 127.0.0.1 --port 5173 --strictPort'
$targets = @('http://127.0.0.1:8000/api/v1/categories', 'http://127.0.0.1:5173/')
foreach ($target in $targets) {
    $ready = $false
    for ($attempt=0; $attempt -lt 45; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $target -UseBasicParsing -TimeoutSec 2
            if ($response.StatusCode -eq 200) { $ready=$true; break }
        } catch { }
        Start-Sleep -Milliseconds 500
    }
    if (-not $ready) { throw "Service did not return HTTP 200: $target. Check its new terminal; no database or processes were reset." }
}
Write-Host 'NOX frontend: http://127.0.0.1:5173/'
Write-Host 'NOX admin:    http://127.0.0.1:8000/admin'
Write-Host 'Stop the two service terminals when finished. No Git branch, remote or database was reset.'
Start-Process 'http://127.0.0.1:5173/'
