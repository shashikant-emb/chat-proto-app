import { createServer } from "miragejs"

export function startMockServer() {
  return createServer({
    routes() {
      this.get("/api/stream", (schema, request) => {
        const msg = request.queryParams.msg || "No message provided"
        return `Agent: ${msg}`
      })
    },
  })
}
