#!/bin/bash

# Script de prueba para extraer productos de tickets usando Google Gemini Vision API
# Uso: ./test-gemini-ticket.sh /path/to/ticket.jpg YOUR_API_KEY

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}Error: Debes proporcionar la ruta a la imagen del ticket${NC}"
    echo "Uso: $0 /path/to/ticket.jpg [API_KEY]"
    exit 1
fi

TICKET_IMAGE="$1"

# API Key: tomar del argumento o del .env
if [ -n "$2" ]; then
    API_KEY="$2"
else
    # Intentar leer del .env
    if [ -f ".env" ]; then
        API_KEY=$(grep VITE_GEMINI_API_KEY .env | cut -d '=' -f2)
    fi
fi

if [ -z "$API_KEY" ] || [ "$API_KEY" == "REPLACE_WITH_YOUR_API_KEY" ]; then
    echo -e "${RED}Error: API key no configurada${NC}"
    echo "Opciones:"
    echo "  1. Pasa la API key como argumento: $0 /path/to/ticket.jpg YOUR_API_KEY"
    echo "  2. Configura VITE_GEMINI_API_KEY en el archivo .env"
    exit 1
fi

# Verificar que el archivo existe
if [ ! -f "$TICKET_IMAGE" ]; then
    echo -e "${RED}Error: El archivo '$TICKET_IMAGE' no existe${NC}"
    exit 1
fi

echo -e "${YELLOW}🎫 Analizando ticket: $TICKET_IMAGE${NC}"
echo -e "${YELLOW}📊 Usando: Google Gemini 2.0 Flash${NC}"
echo -e "${YELLOW}🔑 API Key: ${API_KEY:0:10}...${NC}"
echo ""

# Prompt optimizado
PROMPT='This is a grocery receipt document. Extract product names, quantities, and prices.

Format: product_name | quantity | price

Rules:
- Extract ONLY purchased items (products)
- Keep exact product names as shown (even if abbreviated)
- IMPORTANT: Detect quantity from multiple sources:
  * In product name: "LECHUGA 6U" → quantity = 6
  * Next line format: "6 Un x 0.97 €/un" → quantity = 6, unit_price = 0.97
  * Next line format: "4 x 1.50" → quantity = 4, unit_price = 1.50
  * If no quantity indicator, use 1
- Extract unit price per item (€/un, price per unit)
- Skip store name, date, totals, taxes, payment method
- One product per line in output
- NO explanations, ONLY data

Example output:
Leche Entera | 6 | 0.97
Lechuga 6U | 6 | 1.99
Pan | 1 | 1.20

Extract products:'

# Convertir imagen a base64
echo -e "${YELLOW}🔄 Convirtiendo imagen a base64...${NC}"
IMAGE_BASE64=$(base64 -i "$TICKET_IMAGE" | tr -d '\n')

# Obtener mime type
MIME_TYPE=$(file --mime-type -b "$TICKET_IMAGE")

# Crear archivo temporal con JSON request
TMP_REQUEST=$(mktemp)
cat > "$TMP_REQUEST" <<EOF
{
  "contents": [{
    "parts": [
      {
        "text": $(echo "$PROMPT" | jq -Rs .)
      },
      {
        "inline_data": {
          "mime_type": "$MIME_TYPE",
          "data": "$IMAGE_BASE64"
        }
      }
    ]
  }],
  "generationConfig": {
    "temperature": 0.1,
    "maxOutputTokens": 2048
  }
}
EOF

echo -e "${YELLOW}🤖 Llamando a Gemini API...${NC}"
echo -e "${BLUE}⏳ Esto suele tardar 1-3 segundos...${NC}"
echo ""

# Llamar a la API y medir tiempo
START_TIME=$(date +%s)
RESPONSE=$(curl -s \
  -H "Content-Type: application/json" \
  -d @"$TMP_REQUEST" \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$API_KEY")
CURL_EXIT=$?
END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

# Limpiar archivo temporal
rm "$TMP_REQUEST"

# Verificar si curl falló
if [ $CURL_EXIT -ne 0 ]; then
    echo -e "${RED}❌ Error al llamar a Gemini API${NC}"
    exit 1
fi

# Verificar si hay error en la respuesta
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
    ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error.message')
    echo -e "${RED}❌ Error de Gemini API: $ERROR_MSG${NC}"
    exit 1
fi

# Extraer el texto de la respuesta
EXTRACTED_TEXT=$(echo "$RESPONSE" | jq -r '.candidates[0].content.parts[0].text' 2>/dev/null)

if [ -z "$EXTRACTED_TEXT" ] || [ "$EXTRACTED_TEXT" == "null" ]; then
    echo -e "${RED}❌ No se pudo extraer texto de la respuesta${NC}"
    echo "Respuesta completa:"
    echo "$RESPONSE" | jq .
    exit 1
fi

# Mostrar resultado
echo -e "${GREEN}✅ Extracción completada en ${ELAPSED}s${NC}"
echo ""
echo "=========================================="
echo "$EXTRACTED_TEXT"
echo "=========================================="
echo ""

# Contar productos extraídos (líneas con |)
PRODUCT_COUNT=$(echo "$EXTRACTED_TEXT" | grep -c '|' 2>/dev/null || echo "0")
echo -e "${GREEN}📦 Total productos detectados: $PRODUCT_COUNT${NC}"
echo ""

# Resultado esperado para comparar
echo -e "${BLUE}📋 Ahora probando extracción con PRECIOS incluidos${NC}"
echo -e "${BLUE}Verifica que cada línea tenga formato: producto | cantidad | precio${NC}"
echo ""

# Guardar en archivo
OUTPUT_FILE="gemini-extraction-$(date +%Y%m%d-%H%M%S).txt"
echo "$EXTRACTED_TEXT" > "$OUTPUT_FILE"
echo -e "${GREEN}💾 Resultado guardado en: $OUTPUT_FILE${NC}"

# Mostrar sugerencia
echo ""
echo -e "${GREEN}✨ Si el resultado es bueno, Gemini está listo para usar en la app!${NC}"