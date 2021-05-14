import { processBuildJobs } from "./elements/buildJobs"
import { processIncome } from "./elements/resources"

const logTiming = false

export async function tick() {
  if (logTiming) console.time("tick")
  await processIncome()
  if (logTiming) console.timeLog("tick")
  await processBuildJobs()
  if (logTiming) console.timeEnd("tick")
}
