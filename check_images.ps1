# Check all img src and href references in HTML files
$root = "c:\Users\ErikSöderman\OneDrive - Standard Audio Systems AB\Dokument\bergalids-kennel"
$broken = @()

$htmlFiles = Get-ChildItem $root -Recurse -Filter "*.html"
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Find all img src
    $imgs = [regex]::Matches($content, 'src="([^"]+\.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|HEIC))"')
    foreach ($m in $imgs) {
        $src = $m.Groups[1].Value
        if ($src -match "^http") { continue }  # skip external
        
        # Resolve relative to file's directory
        $fileDir = $file.DirectoryName
        $absPath = Join-Path $fileDir $src
        $absPath = [System.IO.Path]::GetFullPath($absPath)
        
        if (-not (Test-Path $absPath)) {
            $broken += [PSCustomObject]@{
                File = $file.FullName.Replace($root + "\", "")
                Src = $src
                Resolved = $absPath.Replace($root + "\", "")
            }
        }
    }
}

if ($broken.Count -eq 0) {
    Write-Host "INGEN trasig bild!"
} else {
    Write-Host "TRASIGA BILDER:`n"
    $broken | Format-Table -AutoSize
}
