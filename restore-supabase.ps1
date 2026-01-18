param(
  [Parameter(Mandatory=$true)]
  [string]$DumpFile,

  [Parameter(Mandatory=$true)]
  [string]$DbUrl,

  [ValidateSet("Full","SchemaOnly","DataOnly")]
  [string]$Mode = "Full",

  [switch]$NoDrop,

  [string]$DockerImage = "postgres:17",

  [string]$Dns1 = "1.1.1.1",
  [string]$Dns2 = "8.8.8.8"
)

$ErrorActionPreference = "Stop"

if (-not $env:PGPASSWORD -or $env:PGPASSWORD.Trim().Length -eq 0) {
  throw "Missing env var PGPASSWORD. Set it first: `$env:PGPASSWORD = '<DB_PASSWORD>'"
}

# Force SSL
$env:PGSSLMODE = "require"

# Resolve dump path
if (-not (Test-Path $DumpFile)) { throw "Dump file not found: $DumpFile" }
$DumpAbs = (Resolve-Path $DumpFile).Path
$DumpDir = Split-Path $DumpAbs -Parent
$DumpName = Split-Path $DumpAbs -Leaf

Write-Host "==> Restore target DB: $DbUrl"
Write-Host "==> Dump: $DumpAbs"
Write-Host "==> Mode: $Mode"
Write-Host "==> Image: $DockerImage"
Write-Host "==> Drop before restore: $(-not $NoDrop.IsPresent)"

# 0) Connectivity check
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  $DockerImage `
  psql "$DbUrl" -c "select now() as server_time, current_database() as db;"

if ($LASTEXITCODE -ne 0) { throw "psql connectivity check failed (exit=$LASTEXITCODE)" }

# 1) Restore command options
$restoreArgs = @("--dbname=$DbUrl","--no-owner","--no-privileges","--verbose")

# drop schema objects (recommended for clean restore)
if (-not $NoDrop.IsPresent) {
  $restoreArgs += "-c"  # --clean (drop objects before recreating)
  $restoreArgs += "--if-exists"
}

switch ($Mode) {
  "SchemaOnly" { $restoreArgs += "--schema-only" }
  "DataOnly"   { $restoreArgs += "--data-only" }
  default      { } # Full
}

# 2) Run pg_restore (dump format custom)
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  -v "${DumpDir}:/backup" `
  $DockerImage `
  pg_restore @restoreArgs "/backup/$DumpName"

if ($LASTEXITCODE -ne 0) { throw "pg_restore failed (exit=$LASTEXITCODE)" }

# 3) Quick sanity checks (counts)
docker run --rm --dns $Dns1 --dns $Dns2 `
  -e "PGPASSWORD=$env:PGPASSWORD" `
  -e "PGSSLMODE=$env:PGSSLMODE" `
  $DockerImage `
  psql "$DbUrl" -c "select count(*) as table_count from information_schema.tables where table_schema not in ('pg_catalog','information_schema');"

Write-Host "✅ RESTORE DONE"
