if (!(Test-Path "./API/schemas")) {
  New-Item -ItemType Directory -Path "./API/schemas"
}

if (!(Test-Path "./API/schemas/.gitkeep")) {
  New-Item -ItemType File -Path "./API/schemas/.gitkeep"
}

Invoke-WebRequest -URI "http://localhost:5005/swagger/v1/swagger.yaml" -OutFile ./API/schemas/AutoShopDev.yaml

Copy-Item ./API/schemas/AutoShopDev.yaml ./API/schemas/AutoShopProd.yaml

yarn openapi-generator-cli generate -i ./API/schemas/AutoShopDev.yaml -g typescript-fetch -o ./API/AutoShopApi
