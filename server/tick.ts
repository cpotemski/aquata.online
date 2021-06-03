import { processHarvesterBuildJobs } from "./elements/harvesterBuildJobs"
import { createResourceNodes } from "./elements/createResourceNodes"
import { processIncome } from "./elements/resources"
import { processShipBuildJobs } from "./elements/shipBuildJobs"

const logTiming = false
const tickEnabled = true

export async function tick() {
  if (tickEnabled) {
    console.log("Tick!", new Date())
    if (logTiming) console.time("tick")
    await processIncome()
    if (logTiming) console.timeLog("tick")
    await processHarvesterBuildJobs()
    if (logTiming) console.timeLog("tick")
    await processShipBuildJobs()
    if (logTiming) console.timeLog("tick")
    await createResourceNodes()
    if (logTiming) console.timeEnd("tick")
  }
}
