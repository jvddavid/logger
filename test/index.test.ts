import {
  describe,
  expect,
  it
} from "bun:test"

import { Logger } from "@/index"

describe("Logger", () => {
  it("should create a new logger", () => {
    const logger = new Logger({ name: "test" })
    logger.log("info", "test")
    expect(logger).toBeDefined()
  })

  it("should update the logger options", () => {
    const logger = new Logger({ name: "test" })
    logger.updateOptions({ name: "test2" })
    expect(logger).toBeDefined()
  })
})
