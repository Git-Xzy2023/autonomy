Add-Type -AssemblyName System.IO.Compression.FileSystem

$baseDir = Get-Location
$docxPath = Join-Path $baseDir "tmp_net.docx"

$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xml = $reader.ReadToEnd()
$reader.Close()
$zip.Dispose()

# Parse paragraphs - split by </w:p>
$paragraphs = [regex]::Split($xml, '</w:p>')

$output = New-Object System.Collections.Generic.List[string]
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
            $output.Add("$prefix $lineText")
        } else {
            $output.Add($lineText)
        }
    }
}

$outFile = Join-Path $baseDir "extracted_network.txt"
$output | Out-File -FilePath $outFile -Encoding UTF8
Write-Output "Done: $($output.Count) paragraphs saved to extracted_network.txt"
