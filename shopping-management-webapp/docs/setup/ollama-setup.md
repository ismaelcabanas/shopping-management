# Ollama Setup Guide for Ticket Scanning

This guide walks you through setting up Ollama + LLaVA for local OCR processing in the Shopping Management app.

---

## 📦 Prerequisites

- **macOS, Linux, or Windows (WSL2)**
- **Minimum 8GB RAM** (16GB recommended)
- **10GB free disk space** (for model storage)
- **Optional:** NVIDIA GPU for faster processing (CUDA support)

---

## 🚀 Installation

### Option 1: macOS / Linux (Recommended)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version
```

### Option 2: macOS (Homebrew)

```bash
# Install via Homebrew
brew install ollama

# Verify installation
ollama --version
```

### Option 3: Windows (WSL2)

```bash
# Inside WSL2 terminal
curl -fsSL https://ollama.com/install.sh | sh

# Verify installation
ollama --version
```

### Option 4: Docker

```bash
# Pull Ollama Docker image
docker pull ollama/ollama

# Run Ollama server
docker run -d \
  -v ollama:/root/.ollama \
  -p 11434:11434 \
  --name ollama \
  ollama/ollama
```

---

## 🧠 Download Vision Model

After installing Ollama, you need to download the LLaVA vision model:

```bash
# Start Ollama server (if not already running)
ollama serve

# In a new terminal, pull the LLaVA model
# Option 1: Small & fast (recommended for development)
ollama pull llava

# Option 2: Better quality (larger model)
ollama pull llava:13b

# Option 3: Best quality (requires more resources)
ollama pull llava:34b

# Option 4: Optimized for documents/receipts
ollama pull bakllava
```

**Model sizes:**
- `llava` (7B): ~4GB download, ~8GB RAM
- `llava:13b`: ~8GB download, ~16GB RAM
- `llava:34b`: ~20GB download, ~32GB RAM
- `bakllava`: ~4GB download, ~8GB RAM

---

## ✅ Verify Installation

Test that everything works:

```bash
# Check if Ollama server is running
curl http://localhost:11434/api/version

# Expected output:
# {"version":"0.1.x"}

# List installed models
ollama list

# Expected output should include llava
```

---

## 🔧 Configure the App

The Shopping Management app automatically detects Ollama if it's running on `localhost:11434`.

### Environment Variables (Optional)

Create/edit `.env` file in the project root:

```bash
# Ollama configuration
VITE_OLLAMA_BASE_URL=http://localhost:11434  # Default
VITE_OLLAMA_MODEL=llava                       # Default model
```

### Custom Ollama URL

If Ollama is running on a different host/port:

```bash
# .env
VITE_OLLAMA_BASE_URL=http://192.168.1.100:11434
```

---

## 🧪 Test OCR Extraction

### Quick Test via CLI

```bash
# Download a test receipt image
curl -o test-receipt.jpg https://example.com/receipt.jpg

# Test extraction using Ollama directly
ollama run llava "Describe this image" < test-receipt.jpg
```

### Test in the App

1. Start the app: `npm run dev`
2. Navigate to **Product Catalog**
3. Click **"Escanear Ticket"**
4. Upload a receipt image
5. Verify products are detected

---

## 🐛 Troubleshooting

### Issue: "Ollama API error: Failed to fetch"

**Cause:** Ollama server not running

**Solution:**
```bash
# Start Ollama server
ollama serve

# Or if using systemd (Linux)
systemctl start ollama
```

---

### Issue: "Model not found: llava"

**Cause:** LLaVA model not downloaded

**Solution:**
```bash
# Pull the model
ollama pull llava

# Verify it's installed
ollama list
```

---

### Issue: "Connection refused on localhost:11434"

**Cause:** Firewall or Ollama not listening

**Solution:**
```bash
# Check if Ollama is running
ps aux | grep ollama

# Check if port is open
lsof -i :11434

# Restart Ollama
pkill ollama
ollama serve
```

---

### Issue: Slow processing (>30 seconds per image)

**Cause:** Running on CPU without GPU acceleration

**Solutions:**
1. **Use smaller model:** `ollama pull llava:7b` (if not already using it)
2. **Enable GPU (NVIDIA only):**
   ```bash
   # Check if CUDA is available
   nvidia-smi

   # Ollama will automatically use GPU if available
   ```
3. **Reduce image size** before uploading (app should handle this automatically)

---

### Issue: Out of memory errors

**Cause:** Not enough RAM for model

**Solutions:**
1. **Use smaller model:**
   ```bash
   ollama pull llava  # 7B version
   ```
2. **Close other applications** to free up RAM
3. **Increase swap space** (Linux)

---

## 📊 Performance Benchmarks

| Model | Image Size | CPU Time | GPU Time | Quality |
|-------|-----------|----------|----------|---------|
| llava:7b | 1MB | 10-15s | 2-4s | Good |
| llava:13b | 1MB | 20-30s | 4-6s | Better |
| llava:34b | 1MB | 60-90s | 8-12s | Best |
| bakllava | 1MB | 10-15s | 2-4s | Good (documents) |

**Recommendation:** Use `llava:7b` for development, `llava:13b` for production.

---

## 🔄 Updating Ollama

```bash
# Update Ollama itself
curl -fsSL https://ollama.com/install.sh | sh

# Update models
ollama pull llava  # Re-downloads latest version
```

---

## 🗑️ Uninstallation

```bash
# Stop Ollama service
pkill ollama

# Remove Ollama binary
sudo rm $(which ollama)

# Remove models and data
rm -rf ~/.ollama

# macOS only: Remove from Applications
rm -rf /Applications/Ollama.app
```

---

## 🔐 Security Considerations

1. **Ollama listens on localhost by default** - safe for local development
2. **Don't expose Ollama to the internet** without authentication
3. **All processing is local** - receipt images never leave your machine

---

## 🚀 Production Deployment

### Option 1: Deploy Ollama alongside the app

```yaml
# docker-compose.yml
services:
  ollama:
    image: ollama/ollama
    volumes:
      - ollama:/root/.ollama
    ports:
      - "11434:11434"
    environment:
      - OLLAMA_HOST=0.0.0.0

  app:
    build: .
    environment:
      - VITE_OLLAMA_BASE_URL=http://ollama:11434
    depends_on:
      - ollama
```

### Option 2: Use a cloud OCR service

If local processing isn't feasible in production, switch to a cloud provider:

```bash
# .env
VITE_OCR_PROVIDER=gemini
VITE_GEMINI_API_KEY=your-api-key
```

See `docs/architecture/ocr-providers.md` for alternative providers.

---

## 📚 Additional Resources

- [Ollama Documentation](https://github.com/ollama/ollama)
- [LLaVA Model Card](https://ollama.com/library/llava)
- [Vision API Comparison](./docs/architecture/ocr-providers.md)
- [Troubleshooting Guide](https://github.com/ollama/ollama/blob/main/docs/troubleshooting.md)

---

## ✅ Quick Start Checklist

- [ ] Install Ollama
- [ ] Start Ollama server (`ollama serve`)
- [ ] Pull LLaVA model (`ollama pull llava`)
- [ ] Verify server is running (`curl http://localhost:11434/api/version`)
- [ ] Test in the app (upload a receipt)
- [ ] Check console for errors if it doesn't work

---

**Last Updated:** 2024-01-21
**Ollama Version:** 0.1.x
**Model Version:** llava (7B)
