Add-Type -AssemblyName System.IO.Compression.FileSystem

$sourcePath = "d:\B徐志远\autonomy-main\autonomy-main\docs\interview\frontend\network\计算机网络篇.docx"
$tempPath = Join-Path (Get-Location) "temp_network.docx"
Copy-Item -Path $sourcePath -Destination $tempPath -Force

$zip = [System.IO.Compression.ZipFile]::OpenRead($tempPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Parse paragraphs - split by </w:p>
$paragraphs = [regex]::Split($xml, '</w:p>')

$output = @()
foreach ($para in $paragraphs) {
    # Check for heading styles
    $isHeading = $false
    $headingLevel = 0
    if ($para -match 'pStyle="Heading(\d+)"') {
        $isHeading = $true
        $headingLevel = [int]$Matches[1]
    }

    # Extract text from w:t elements
    $tMatches = [regex]::Matches($para, '<w:t[^>]*>([^<]+)</w:t>')
    $lineText = ""
    foreach ($tMatch in $tMatches) {
        $lineText += $tMatch.Groups[1].Value
    }

    $lineText = $lineText.Trim()
    if ($lineText -ne "") {
        if ($isHeading) {
            $prefix = "#" * $headingLevel
            $output += "$prefix $lineText"
        } else {
            $output += $lineText
        }
    }
}

$output | Out-File -FilePath "extracted_network.txt" -Encoding UTF8
Write-Output "Done: $($output.Count) paragraphs"
