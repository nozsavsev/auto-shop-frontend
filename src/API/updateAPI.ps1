if (!(Test-Path "./src/API/schemas")) {
  New-Item -ItemType Directory -Path "./src/API/schemas"
}

if (!(Test-Path "./src/API/schemas/.gitkeep")) {
  New-Item -ItemType File -Path "./src/API/schemas/.gitkeep"
}

Invoke-WebRequest -URI "http://localhost:5005/swagger/v1/swagger.yaml" -OutFile ./src/API/schemas/AutoShopDev.yaml

Copy-Item ./src/API/schemas/AutoShopDev.yaml ./src/API/schemas/AutoShopProd.yaml

yarn openapi-generator-cli generate -i ./src/API/schemas/AutoShopDev.yaml -g typescript-fetch -o ./src/API/AutoShopApi
