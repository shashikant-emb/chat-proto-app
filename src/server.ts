import { startMockServer } from "./server/mockServer"

// Start the mock server in development
if (import.meta.env.DEV) {
  startMockServer()
}
