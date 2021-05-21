import { processBuildJobs } from "./elements/buildJobs"
import { createResourceNodes } from "./elements/createResourceNodes"
import { processIncome } from "./elements/resources"

const logTiming = false
const tickEnabled = true

export async function tick() {
  if (tickEnabled) {
    console.log("Tick!", new Date())
    if (logTiming) console.time("tick")
    await processIncome()
    if (logTiming) console.timeLog("tick")
    await processBuildJobs()
    if (logTiming) console.timeLog("tick")
    await createResourceNodes()
    if (logTiming) console.timeEnd("tick")
  }
}
