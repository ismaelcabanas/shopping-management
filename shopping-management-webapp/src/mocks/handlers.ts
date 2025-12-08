/**
 * MSW Request Handlers
 *
 * Define mock responses for external APIs used in E2E tests.
 * These handlers intercept HTTP requests at the network level.
 */

import { http, HttpResponse } from 'msw'

/**
 * Mock response for Gemini API ticket scanning
 * Simulates successful OCR of a grocery receipt
 *
 * Default response matches US-011 test expectations:
 * - Milk: 3 units
 * - Bread: 2 units
 * - Rice: 1 unit
 * - Eggs: 6 units
 *
 * IMPORTANT: The text format must match what TicketParser expects:
 * Each line in format: "product_name | quantity"
 */
const mockGeminiSuccessResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: `Milk | 3
Bread | 2
Rice | 1
Eggs | 6`
          }
        ],
        role: 'model'
      },
      finishReason: 'STOP',
      index: 0,
      safetyRatings: []
    }
  ]
}

/**
 * Gemini API handlers
 */
export const geminiHandlers = [
  // Intercept Gemini Vision API requests
  // The actual URL is: POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}
  http.post('https://generativelanguage.googleapis.com/v1beta/models/:model\\:generateContent', ({ params }) => {
    console.log('[MSW] Intercepted Gemini API request for model:', params.model)
    return HttpResponse.json(mockGeminiSuccessResponse)
  })
]

/**
 * All request handlers for MSW
 * Export this array to configure MSW server
 */
export const handlers = [
  ...geminiHandlers
]
