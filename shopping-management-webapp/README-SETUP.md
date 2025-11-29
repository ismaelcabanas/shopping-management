# Shopping Management WebApp - Setup Guide

## Configuración de Variables de Entorno

Este proyecto requiere configurar variables de entorno para funcionar correctamente, especialmente para la funcionalidad de escaneo OCR de tickets.

### Paso 1: Crear archivo .env

Copia el archivo de ejemplo y renómbralo:

```bash
cp .env.example .env
```

### Paso 2: Configurar Gemini API (Recomendado - Gratuito)

El proyecto usa Google Gemini Vision API para escanear tickets. Es **gratuito** con límite de 60 peticiones/minuto.

1. **Obtén tu API Key gratuita:**
   - Ve a: https://makersuite.google.com/app/apikey
   - Inicia sesión con tu cuenta de Google
   - Haz clic en "Create API Key"
   - Copia la API key generada

2. **Configura tu `.env`:**

```bash
VITE_OCR_PROVIDER=gemini
VITE_GEMINI_API_KEY=tu-api-key-aqui
VITE_GEMINI_MODEL=gemini-2.0-flash
```

### Paso 3: Instalar dependencias y ejecutar

```bash
npm install
npm run dev
```

## Funcionalidades del OCR

La aplicación puede extraer automáticamente:
- ✅ Nombres de productos del ticket
- ✅ Cantidades de cada producto (incluyendo multi-línea como "6 Un x 0.97 €/un")
- ✅ Detecta cantidades en nombres de producto (ej: "LECHUGA 6U" → cantidad 6)

## Proveedores OCR Alternativos

### Ollama (Local - Sin API Key necesaria)

Si prefieres no usar una API de terceros:

```bash
VITE_OCR_PROVIDER=ollama
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llava
```

**Requisito:** Debes tener Ollama instalado localmente.

## Seguridad

⚠️ **IMPORTANTE:**
- El archivo `.env` contiene información sensible (API keys)
- **NUNCA** subas el archivo `.env` al repositorio
- El archivo `.env` está en `.gitignore` para protegerte
- Usa `.env.example` como plantilla sin datos sensibles