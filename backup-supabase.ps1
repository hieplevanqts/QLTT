# backup-supabase.ps1 (STABLE - Session pooler)
$ErrorActionPreference = "Stop"

$ProjectRef = "mwuhuixkybbwrnoqcibg"
$DbHost     = "aws-1-ap-south-1.pooler.supabase.com"
$DbPort     = 5432
$DbName     = "postgres"
$DbUser     = "postgres.$ProjectRef"
$Schemas    = @("public","auth","storage")

$RetentionDays = 30
$CreateZip     = $true

# Docker DNS override
$Dns1 = "1.1.1.1"
$Dns2 = "8.8.8.8"

if (-not $env:PGPASSWORD -or $env:PGPASSWORD.Trim().Length -eq 0) {
  throw "Missing env var PGPASSWORD. Set it first: `$env:PGPASSWORD = '<DB_PASSWORD>'"
}

# Force SSL via env (avoid URL parsing bugs)
$env:PGSSLMODE = "require"

# IMPORTANT: escape ':' in PowerShell string with backtick ` before : in host:port
$DbUrl = "postgresql://$DbUser@$DbHost`:$DbPort/$DbName"

$Today = Get-Date -Format "yyyy-MM-dd"
$Time  = Get-Date -Format "yyyyMMdd_HHmmss"
$OutDir = Join-Path (Get-Location) "backups\$ProjectRef\$Today"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutDirAbs = (Resolve-Path $OutDir).Path

$Base      = "${ProjectRef}_${Time}"
$DumpFile  = Join-Path $OutDir "$Base.dump"
$SchemaFile= Join-Path $OutDir "$Base.schema.sql"
$Manifest  = Join-Path $OutDir "$Base.manifest.txt"
$ZipFile   = Join-Path $OutDir "$Base.zip"

Write-Host "==> Target (Session pooler): $($DbHost):$DbPort"
Write-Host "==> User: $DbUser"
Write-Host "==> DB: $DbName"
Write-Host "==> Schemas: $($Schemas -join ', ')"
Write-Host "==> Output: $OutDirAbs"

# Build schema flags
$schemaFlags = @()
foreach ($s in $Schemas) { $schemaFlags += "--schema=$s" }

# 1) Connectivity check
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  postgres:17 `
  psql "$DbUrl" -c "select now() as server_time, current_database() as db;"

if ($LASTEXITCODE -ne 0) { throw "psql connectivity check failed (exit=$LASTEXITCODE)" }

# 2) Full dump
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  -v "${OutDirAbs}:/backup" `
  postgres:17 `
  pg_dump --dbname="$DbUrl" --format=custom --no-owner --no-privileges `
  @schemaFlags `
  -f "/backup/$Base.dump"

if ($LASTEXITCODE -ne 0) { throw "pg_dump (custom) failed (exit=$LASTEXITCODE)" }

# 3) Schema-only
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  -v "${OutDirAbs}:/backup" `
  postgres:17 `
  pg_dump --dbname="$DbUrl" --schema-only --no-owner --no-privileges `
  @schemaFlags `
  -f "/backup/$Base.schema.sql"

if ($LASTEXITCODE -ne 0) { throw "pg_dump (schema-only) failed (exit=$LASTEXITCODE)" }

if (-not (Test-Path $DumpFile))   { throw "Missing dump file: $DumpFile" }
if (-not (Test-Path $SchemaFile)) { throw "Missing schema file: $SchemaFile" }

Get-FileHash -Algorithm SHA256 $DumpFile, $SchemaFile |
  ForEach-Object { "$($_.Path)`t$($_.Hash)" } |
  Out-File -Encoding utf8 $Manifest

if ($CreateZip) {
  if (Test-Path $ZipFile) { Remove-Item $ZipFile -Force }
  Compress-Archive -Path $DumpFile, $SchemaFile, $Manifest -DestinationPath $ZipFile -Force
}

$RootProject = Join-Path (Join-Path (Get-Location) "backups") $ProjectRef
$cutoff = (Get-Date).AddDays(-$RetentionDays)
Get-ChildItem -Path $RootProject -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.LastWriteTime -lt $cutoff } |
  ForEach-Object { Remove-Item $_.FullName -Recurse -Force }

Write-Host "✅ DONE"
Write-Host "Dump:   $DumpFile"
Write-Host "Schema: $SchemaFile"
Write-Host "Zip:    $ZipFile"
