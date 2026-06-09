$baseDir = Get-Location
Write-Output "Current dir: $baseDir"

$relPath = "docs\interview\frontend\network"
$fullPath = Join-Path $baseDir $relPath
Write-Output "Search path: $fullPath"

if ([System.IO.Directory]::Exists($fullPath)) {
    $files = [System.IO.Directory]::GetFiles($fullPath, "*.docx")
    Write-Output "Found $($files.Length) files"
    foreach ($f in $files) {
        Write-Output "  -> $f"
        [System.IO.File]::Copy($f, (Join-Path $baseDir "tmp_net.docx"), $true)
        Write-Output "  Copied!"
    }
} else {
    Write-Output "Path does not exist, trying alternative..."
    $files = [System.IO.Directory]::GetFiles("$baseDir", "*.docx", [System.IO.SearchOption]::AllDirectories)
    Write-Output "Found $($files.Length) docx files in total"
    foreach ($f in $files) {
        Write-Output "  -> $f"
        if ($f -like "*network*" -or $f -like "*网络*") {
            [System.IO.File]::Copy($f, (Join-Path $baseDir "tmp_net.docx"), $true)
            Write-Output "  Copied!"
            break
        }
    }
}
