import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const msg = searchParams.get("msg") || "No message provided"

  const stream = new ReadableStream({
    async start(controller) {
      // Prepare the response
      const agentResponse = `Agent: ${msg}`

      // Split the response into chunks (simulating streaming)
      const chunks = [
        agentResponse.substring(0, Math.floor(agentResponse.length / 2)),
        agentResponse.substring(Math.floor(agentResponse.length / 2)),
      ]

      // Send the first chunk
      const encoder = new TextEncoder()
      controller.enqueue(encoder.encode(chunks[0]))

 
      await new Promise((resolve) => setTimeout(resolve, 1000))

      controller.enqueue(encoder.encode(chunks[1]))

      // Close the stream
      controller.close()
    },
  })

  // Return the stream as a response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
