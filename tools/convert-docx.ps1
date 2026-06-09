param(
    [Parameter(Mandatory = $true, HelpMessage = "输入的 .docx 文件路径")]
    [string]$InputPath,

    [Parameter(HelpMessage = "输出的 .md 文件路径，不填则默认与输入同目录同名")]
    [string]$OutputPath = ""
)

Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.Xml.Linq
$ErrorActionPreference = "Stop"

function Parse-Paragraph {
    param(
        $p,
        $ns,
        [ref]$listLevelCounterRef
    )

    $pPr = $p.Element($ns + "pPr")
    $headingLevel = 0
    $isList = $false
    $listLevel = 0
    $isOrdered = $false

    if ($null -ne $pPr) {
        $pStyle = $pPr.Element($ns + "pStyle")
        if ($null -ne $pStyle) {
            $val = $pStyle.Attribute($ns + "val")
            if ($null -ne $val) {
                $styleName = $val.Value
                if ($styleName -match '^Heading(\d+)$') {
                    $headingLevel = [int]$Matches[1]
                } elseif ($styleName -eq 'Title') {
                    $headingLevel = 1
                }
            }
        }

        $numPr = $pPr.Element($ns + "numPr")
        if ($null -ne $numPr) {
            $isList = $true
            $ilvl = $numPr.Element($ns + "ilvl")
            if ($null -ne $ilvl) {
                $lv = $ilvl.Attribute($ns + "val")
                if ($null -ne $lv) {
                    $listLevel = [int]$lv.Value
                }
            }
            $numId = $numPr.Element($ns + "numId")
            if ($null -ne $numId) {
                $id = $numId.Attribute($ns + "val")
                if ($null -ne $id) {
                    try {
                        $idVal = [int]$id.Value
                        $isOrdered = ($idVal % 2 -eq 0)
                    } catch {
                        $isOrdered = $false
                    }
                }
            }
        }
    }

    $textContent = Extract-RunText $p $ns

    if ([string]::IsNullOrWhiteSpace($textContent)) {
        return ""
    }

    $textContent = $textContent.Trim()

    if ($headingLevel -gt 0) {
        if ($headingLevel -gt 6) { $headingLevel = 6 }
        $prefix = "#" * $headingLevel
        return "$prefix $textContent"
    }

    if ($isList) {
        $indent = "  " * [math]::Max(0, $listLevel)
        if ($isOrdered) {
            $counterKey = "ordered_$listLevel"
            if (-not $listLevelCounterRef.Value.Contains($counterKey)) {
                $listLevelCounterRef.Value[$counterKey] = 0
            }
            $listLevelCounterRef.Value[$counterKey] += 1
            $num = $listLevelCounterRef.Value[$counterKey]
            return "$indent$num. $textContent"
        } else {
            return "$indent- $textContent"
        }
    }

    return $textContent
}

function Extract-RunText {
    param($element, $ns)

    $result = ""
    $runs = $element.Descendants($ns + "r")

    foreach ($r in $runs) {
        $runText = ""
        $isBold = $false
        $isItalic = $false

        $rPr = $r.Element($ns + "rPr")
        if ($null -ne $rPr) {
            $b = $rPr.Element($ns + "b")
            if ($null -ne $b) {
                $val = $b.Attribute($ns + "val")
                if ($null -eq $val -or $val.Value -ne "0") {
                    $isBold = $true
                }
            }
            $i = $rPr.Element($ns + "i")
            if ($null -ne $i) {
                $val = $i.Attribute($ns + "val")
                if ($null -eq $val -or $val.Value -ne "0") {
                    $isItalic = $true
                }
            }
        }

        $t = $r.Element($ns + "t")
        if ($null -ne $t) {
            $runText = $t.Value
        }

        $br = $r.Element($ns + "br")
        if ($null -ne $br) {
            $result += "  `r`n"
            continue
        }

        if (-not [string]::IsNullOrEmpty($runText)) {
            if ($isBold -and $isItalic) {
                $result += "***$runText***"
            } elseif ($isBold) {
                $result += "**$runText**"
            } elseif ($isItalic) {
                $result += "*$runText*"
            } else {
                $result += $runText
            }
        }
    }

    return $result
}

function Parse-Table {
    param($tbl, $ns)

    $lines = New-Object System.Collections.Generic.List[string]
    $rows = $tbl.Elements($ns + "tr")
    $rowCount = 0

    foreach ($tr in $rows) {
        $cells = $tr.Elements($ns + "tc")
        $cellTexts = New-Object System.Collections.Generic.List[string]

        foreach ($tc in $cells) {
            $cellText = (Extract-RunText $tc $ns).Trim()
            $cellText = $cellText -replace "`r`n", " "
            $cellText = $cellText -replace "`n", " "
            $cellText = $cellText -replace "\|", "\|"
            $cellTexts.Add($cellText)
        }

        $rowLine = "| " + ($cellTexts -join " | ") + " |"
        $lines.Add($rowLine)
        $rowCount++

        if ($rowCount -eq 1) {
            $seps = New-Object System.Collections.Generic.List[string]
            for ($i = 0; $i -lt $cellTexts.Count; $i++) {
                $seps.Add("---")
            }
            $sepLine = "| " + ($seps -join " | ") + " |"
            $lines.Add($sepLine)
        }
    }

    return $lines
}

# ======= 主逻辑 =======

$InputPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($InputPath)

if (-not [System.IO.File]::Exists($InputPath)) {
    Write-Error "找不到文件: $InputPath"
    exit 1
}

if ([System.IO.Path]::GetExtension($InputPath).ToLower() -ne ".docx") {
    Write-Error "只支持 .docx 文件"
    exit 1
}

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $dir = [System.IO.Path]::GetDirectoryName($InputPath)
    $name = [System.IO.Path]::GetFileNameWithoutExtension($InputPath)
    $OutputPath = Join-Path $dir "$name.md"
} else {
    $OutputPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($OutputPath)
}

Write-Host "转换中:" -ForegroundColor Cyan
Write-Host "  输入: $InputPath"
Write-Host "  输出: $OutputPath"
Write-Host ""

$tempFile = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName() + ".docx")
Copy-Item -Path $InputPath -Destination $tempFile -Force

$outputLines = New-Object System.Collections.Generic.List[string]
$listLevelCounter = @{}

try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($tempFile)

    $docEntry = $zip.GetEntry("word/document.xml")
    if ($null -eq $docEntry) {
        $zip.Dispose()
        Write-Error "docx 文件缺少 word/document.xml"
        exit 1
    }

    $stream = $docEntry.Open()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()

    $zip.Dispose()

    $xDoc = [System.Xml.Linq.XDocument]::Parse($xmlContent)
    $nsW = [System.Xml.Linq.XNamespace]::Get("http://schemas.openxmlformats.org/wordprocessingml/2006/main")

    $body = $xDoc.Descendants($nsW + "body") | Select-Object -First 1
    if ($null -eq $body) {
        Write-Error "找不到 body 元素"
        exit 1
    }

    foreach ($element in $body.Elements()) {
        $elemName = $element.Name.LocalName

        if ($elemName -eq "p") {
            $line = Parse-Paragraph $element $nsW ([ref]$listLevelCounter)
            if (-not [string]::IsNullOrEmpty($line)) {
                $outputLines.Add($line)
            }
        } elseif ($elemName -eq "tbl") {
            $tableLines = Parse-Table $element $nsW
            foreach ($tl in $tableLines) {
                $outputLines.Add($tl)
            }
        }
    }

} catch {
    Write-Error "处理失败: $_"
    exit 1
} finally {
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
    }
}

$outputText = ($outputLines -join "`r`n")
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($OutputPath, $outputText, $utf8NoBom)

Write-Host ""
Write-Host "完成! 共 $($outputLines.Count) 行，已写入:" -ForegroundColor Green
Write-Host "  $OutputPath" -ForegroundColor Green
