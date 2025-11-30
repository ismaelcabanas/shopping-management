# OCR Provider Options for Ticket Scanning

## Decision Context

The Shopping Management app needs OCR (Optical Character Recognition) capabilities to extract product information from shopping receipts/tickets. This document outlines available options, their trade-offs, and implementation guides.

---

## 🎯 Requirements

1. **Extract text** from ticket images (photos taken with phone camera)
2. **Identify products and quantities** (e.g., "2x Leche" → product: "Leche", quantity: 2)
3. **Handle poor quality images** (crumpled tickets, bad lighting, etc.)
4. **Cost-effective** for personal use
5. **Privacy-friendly** when possible
6. **Easy to switch providers** (plugin architecture)

---

## 📊 Available Options

### 1. Ollama + LLaVA (Local LLM with Vision) ⚠️ **NOT RECOMMENDED**

**Type:** Multimodal LLM (Local)
**Cost:** Free (unlimited)
**Privacy:** 100% local, data never leaves your machine
**Status:** Tested but proved unreliable for receipt OCR

#### Advantages
- ✅ **Zero cost:** No API fees, no limits
- ✅ **Privacy:** All processing happens locally
- ✅ **No internet required:** Works offline

#### Disadvantages
- ❌ **Unreliable output:** Generates infinite/repeated text
- ❌ **Hallucinations:** Invents products not in the ticket
- ❌ **Privacy rejections:** Sometimes refuses to process receipts citing "personal information"
- ❌ **Inconsistent quality:** Cannot reliably extract structured data
- ❌ **Requires local resources:** Needs GPU for optimal performance
- ❌ **Slower:** 5-15 seconds per image (vs <2s for cloud APIs)
- ❌ **Setup required:** Need to install Ollama + pull model

#### Real-World Testing Results (Feature 009)
**Model Tested:** `llava` (7b)
**Test Scenario:** Spanish grocery receipt with 15 products

**Issues Encountered:**
1. Generated infinite output loops
2. Added explanations despite being told not to
3. Hallucinated products not present in receipt
4. Refused processing claiming privacy concerns
5. Inconsistent format across multiple attempts

**Conclusion:** Not suitable for production use in ticket scanning. Consider for other use cases.

#### When to Use
- **Development:** Perfect for unlimited testing
- **Production:** Good for privacy-focused deployments
- **Personal use:** Ideal when you control the infrastructure

#### Available Models
```bash
# Fast & lightweight (recommended for development)
ollama pull llava:7b

# Better quality
ollama pull llava:13b

# Maximum quality
ollama pull llava:34b

# Optimized for documents/receipts
ollama pull bakllava
```

#### Setup
```bash
# 1. Install Ollama (macOS/Linux)
curl -fsSL https://ollama.com/install.sh | sh

# 2. Pull the model
ollama pull llava:7b

# 3. Start Ollama server (runs on http://localhost:11434)
ollama serve
```

#### Implementation
See: `src/infrastructure/services/ocr/OllamaVisionOCRService.ts`

---

### 2. Google Gemini (Cloud LLM with Vision) ⭐ **RECOMMENDED & ACTIVE**

**Type:** Multimodal LLM (Cloud)
**Cost:** Free tier: 60 requests/minute
**Privacy:** Data sent to Google Cloud
**Status:** Production-ready, actively used in Feature 009

#### Advantages
- ✅ **Proven reliability:** Successfully extracts 15 products from Spanish receipts
- ✅ **Intelligent quantity detection:** Handles "6U" in names and "6 Un x 0.97 €/un" multi-line patterns
- ✅ **Generous free tier:** 60 req/min is enough for personal use
- ✅ **Excellent quality:** State-of-the-art multimodal understanding
- ✅ **Fast:** 2-4 seconds per image (tested)
- ✅ **No infrastructure:** Just API calls
- ✅ **Reliable output:** Consistent formatting, no hallucinations

#### Disadvantages
- ❌ **Requires internet:** Won't work offline
- ❌ **Privacy concerns:** Images sent to Google
- ❌ **Rate limits:** 60 req/min (usually sufficient)
- ❌ **Potential cost:** May incur charges if exceeding free tier

#### Real-World Testing Results (Feature 009)
**Model Used:** `gemini-2.0-flash`
**Test Scenario:** Spanish grocery receipt with 15 products

**Success Metrics:**
- ✅ 100% product extraction accuracy (15/15 products)
- ✅ Correct quantity detection from product names ("LECHUGA 6U" → 6)
- ✅ Correct multi-line quantity parsing ("6 Un x 0.97 €/un" → quantity 6)
- ✅ Consistent pipe-separated format (`product | quantity`)
- ✅ Average response time: 2-4 seconds
- ✅ No hallucinations or fabricated products

#### When to Use
- **Production:** When you need cloud deployment
- **Scalability:** When local resources are insufficient
- **Speed priority:** When you need fast responses

#### Setup
```bash
# Get API key from: https://makersuite.google.com/app/apikey
export GEMINI_API_KEY="your-api-key"
```

#### Pricing (if exceeding free tier)
- **Gemini 1.5 Flash:** $0.00025 per image (~free)
- **Gemini 1.5 Pro:** $0.0025 per image

#### Implementation Template
```typescript
export class GeminiVisionOCRService implements IOCRService {
  async extractText(imageData: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: `Analyze this shopping receipt and extract products with quantities.
                       Format: "product_name | quantity" (one per line)
                       Example: "Leche | 2"`
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageData.split(',')[1] // Remove data:image/jpeg;base64, prefix
                }
              }
            ]
          }]
        })
      }
    );

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
  }
}
```

---

### 3. OpenAI GPT-4 Vision (Cloud LLM)

**Type:** Multimodal LLM (Cloud)
**Cost:** $5 free credits (new accounts), then ~$0.01 per image
**Privacy:** Data sent to OpenAI

#### Advantages
- ✅ **Excellent quality:** Best-in-class understanding
- ✅ **Simple API:** Easy to integrate
- ✅ **Fast:** <2 seconds per image
- ✅ **Reliable:** Mature, stable service

#### Disadvantages
- ❌ **Cost:** More expensive than alternatives (~$0.01/image)
- ❌ **Limited free tier:** Only $5 initial credit
- ❌ **Privacy concerns:** Images sent to OpenAI

#### When to Use
- **Quality priority:** When accuracy is critical
- **Prototype/demo:** When cost isn't a concern

#### Implementation Template
```typescript
export class OpenAIVisionOCRService implements IOCRService {
  async extractText(imageData: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract products and quantities from this receipt. Format: 'product | quantity'"
            },
            {
              type: "image_url",
              image_url: { url: imageData }
            }
          ]
        }],
        max_tokens: 500
      })
    });

    const result = await response.json();
    return result.choices[0].message.content;
  }
}
```

---

### 4. Anthropic Claude 3 (Haiku/Sonnet)

**Type:** Multimodal LLM (Cloud)
**Cost:** Claude Haiku: ~$0.00025 per image (cheapest cloud option)
**Privacy:** Data sent to Anthropic

#### Advantages
- ✅ **Very cheap:** Haiku is the most cost-effective cloud option
- ✅ **Fast:** Especially Haiku variant
- ✅ **Good quality:** Reliable extraction
- ✅ **Simple API:** Clean, easy to use

#### Disadvantages
- ❌ **Limited free tier:** Need to pay upfront
- ❌ **Privacy concerns:** Images sent to Anthropic

#### When to Use
- **Production on budget:** Cheapest cloud option
- **High volume:** When processing many tickets

---

### 5. Tesseract OCR (Traditional OCR)

**Type:** Traditional OCR (Local)
**Cost:** Free, open source
**Privacy:** 100% local

#### Advantages
- ✅ **Free:** No costs ever
- ✅ **Fast:** <1 second per image
- ✅ **Browser-compatible:** Runs in WebAssembly
- ✅ **No server needed:** Pure client-side

#### Disadvantages
- ❌ **No context understanding:** Just extracts text, doesn't understand structure
- ❌ **Requires parsing:** You need to manually parse product names/quantities
- ❌ **Lower accuracy:** Struggles with poor quality images
- ❌ **Manual extraction logic:** Need to write regex/parsing code

#### When to Use
- **Fallback option:** When LLM APIs are down
- **High-quality images:** When tickets are clean and well-formatted
- **Budget constraint:** When cloud costs are prohibitive

#### Implementation Template
```typescript
import Tesseract from 'tesseract.js';

export class TesseractOCRService implements IOCRService {
  async extractText(imageData: string): Promise<string> {
    const worker = await Tesseract.createWorker();
    const { data: { text } } = await worker.recognize(imageData);
    await worker.terminate();
    return text;
  }
}
```

---

### 6. AWS Textract

**Type:** Cloud OCR service
**Cost:** 1,000 pages/month free (first year), then $1.50 per 1,000 pages
**Privacy:** Data sent to AWS

#### Advantages
- ✅ **Document-optimized:** Excellent for structured documents
- ✅ **Table extraction:** Can extract tables from receipts
- ✅ **Good free tier:** 1,000 pages/month

#### Disadvantages
- ❌ **AWS setup required:** More complex infrastructure
- ❌ **Overkill:** More features than needed for simple receipts
- ❌ **Cost after free tier:** $1.50 per 1,000 pages

---

### 7. Azure Computer Vision

**Type:** Cloud OCR service
**Cost:** 5,000 transactions/month free, then $1 per 1,000 images
**Privacy:** Data sent to Microsoft

#### Advantages
- ✅ **Good free tier:** 5,000 transactions/month
- ✅ **Reliable:** Mature service

#### Disadvantages
- ❌ **Azure setup:** Requires Azure account
- ❌ **Traditional OCR:** No context understanding

---

## 🏆 Recommendation Matrix (Updated after Feature 009 Testing)

| Scenario | Recommended Option | Alternative | Notes |
|----------|-------------------|-------------|-------|
| **Development** | **Google Gemini** | MockOCRService | Ollama unreliable for receipts |
| **Production** | **Google Gemini** | Claude Haiku | Proven in production |
| **Personal use** | **Google Gemini** | - | Free tier sufficient |
| **Privacy-critical** | Tesseract (+ custom parsing) | - | Ollama not recommended |
| **Budget-critical** | **Google Gemini** (free tier) | Tesseract | 60 req/min free |
| **Speed-critical** | **Google Gemini** | Claude Haiku | 2-4s per ticket |
| **Offline required** | Tesseract (+ custom parsing) | - | LLMs require internet |

---

## 🔧 Architecture: Switching Providers

The app uses a **plugin architecture** via the `IOCRService` interface, making it trivial to switch providers:

```typescript
// src/domain/services/IOCRService.ts
export interface IOCRService {
  extractText(imageData: string): Promise<string>;
}
```

### To switch providers:

1. **Implement the interface:**
   ```typescript
   export class NewProviderOCRService implements IOCRService {
     async extractText(imageData: string): Promise<string> {
       // Your implementation
     }
   }
   ```

2. **Update the service factory:**
   ```typescript
   // src/infrastructure/services/ocr/OCRServiceFactory.ts
   export function createOCRService(): IOCRService {
     const provider = process.env.VITE_OCR_PROVIDER || 'ollama';

     switch (provider) {
       case 'ollama':
         return new OllamaVisionOCRService();
       case 'gemini':
         return new GeminiVisionOCRService();
       case 'openai':
         return new OpenAIVisionOCRService();
       default:
         return new OllamaVisionOCRService();
     }
   }
   ```

3. **Configure via environment variables:**
   ```bash
   # .env
   VITE_OCR_PROVIDER=ollama  # or 'gemini', 'openai', etc.
   ```

---

## 📈 Cost Comparison (1,000 tickets/month)

| Provider | Monthly Cost | Free Tier |
|----------|--------------|-----------|
| **Ollama** | $0 | ∞ |
| **Gemini** | $0 (within free tier) | 60 req/min |
| **Claude Haiku** | $0.25 | Limited |
| **GPT-4 Vision** | $10 | $5 initial credit |
| **Tesseract** | $0 | ∞ |
| **AWS Textract** | $1.50 (after free year) | 1,000/month (year 1) |
| **Azure CV** | $0 (within free tier) | 5,000/month |

---

## 🚀 Current Implementation

**Active Provider:** Google Gemini Vision (gemini-2.0-flash)
**Implementation:** `src/infrastructure/services/ocr/GeminiVisionOCRService.ts`
**Status:** Production-ready (Feature 009 completed)
**Testing:** Successfully tested with Spanish grocery receipts (15/15 products extracted correctly)
**Alternative:** OllamaVisionOCRService (available but not recommended for receipts)
**Fallback:** MockOCRService (for testing without API keys)

---

## 📚 References

- [Ollama Documentation](https://ollama.com/library/llava)
- [Google Gemini API](https://ai.google.dev/docs)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Anthropic Claude Vision](https://docs.anthropic.com/claude/docs/vision)
- [Tesseract.js](https://tesseract.projectnaptha.com/)
- [AWS Textract](https://aws.amazon.com/textract/)

---

## 🔄 Future Considerations

1. **Hybrid approach:** Use Tesseract for fast extraction + LLM for parsing
2. **Caching:** Store OCR results to avoid re-processing same tickets
3. **Batch processing:** Process multiple tickets in parallel
4. **Model fine-tuning:** Train custom model on receipt data for better accuracy
5. **Edge computing:** Deploy lightweight model to edge (mobile devices)

---

**Last Updated:** 2025-11-30
**Status:** Active (Gemini implementation complete in Feature 009)
