Add-Type -AssemblyName System.Drawing

$outputPath = "c:\Users\User\Desktop\Projects\Techsylph\techsylph\public\og-image.jpg"
$bmp = New-Object System.Drawing.Bitmap(1200, 630)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$rect = New-Object System.Drawing.Rectangle(0, 0, 1200, 630)
$c1 = [System.Drawing.Color]::FromArgb(4, 120, 87)
$c2 = [System.Drawing.Color]::FromArgb(16, 185, 129)
$brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $c1, $c2, 35)

$g.FillRectangle($brush, $rect)
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$titleFont = New-Object System.Drawing.Font("Segoe UI", 72, [System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font("Segoe UI", 30, [System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Regular)
$white = [System.Drawing.Brushes]::White

$g.DrawString("TechSylph", $titleFont, $white, 120, 180)
$g.DrawString("Global Apparel Export from Pakistan", $subtitleFont, $white, 120, 300)
$g.DrawString("Factory-Direct  *  Low MOQ  *  Worldwide Shipping", $smallFont, $white, 120, 370)

$bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

$g.Dispose()
$bmp.Dispose()
$brush.Dispose()
$titleFont.Dispose()
$subtitleFont.Dispose()
$smallFont.Dispose()

Write-Host "Created $outputPath"
