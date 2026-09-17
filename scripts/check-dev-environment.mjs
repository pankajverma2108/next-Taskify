import net from "node:net";
import os from "node:os";

const REQUIRED_NODE_MAJOR = 24;
const DEV_PORT = 3000;
const GIB = 1024 ** 3;
const MIN_FREE_MEMORY = 1 * GIB;
const RECOMMENDED_FREE_MEMORY = 1.5 * GIB;

function formatGiB(bytes) {
  return `${(bytes / GIB).toFixed(2)} GiB`;
}

function inspectPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.unref();
    server.once("error", (error) => resolve(error));
    server.listen({ host: "0.0.0.0", port, exclusive: true }, () => {
      server.close(() => resolve(null));
    });
  });
}

const problems = [];
const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);

if (nodeMajor !== REQUIRED_NODE_MAJOR) {
  problems.push(
    `Node ${REQUIRED_NODE_MAJOR} LTS is required; this shell is using Node ${process.versions.node}.`,
    "Switch runtimes with your Node version manager, then run npm install again.",
  );
}

const freeMemory = os.freemem();
const allowLowMemory = process.env.TASKIFY_ALLOW_LOW_MEMORY === "1";

if (freeMemory < MIN_FREE_MEMORY && !allowLowMemory) {
  problems.push(
    `Only ${formatGiB(freeMemory)} of physical memory is free; Taskify requires at least ${formatGiB(MIN_FREE_MEMORY)} before starting the compiler.`,
    "Close stale dev servers or other memory-heavy tools, then retry. Set TASKIFY_ALLOW_LOW_MEMORY=1 only when you intentionally accept the OOM risk.",
  );
}

const portError = await inspectPort(DEV_PORT);

if (portError?.code === "EADDRINUSE") {
  problems.push(
    `Port ${DEV_PORT} is already in use. Taskify will not silently start a second compiler on another port.`,
    `On Windows, inspect it with: Get-NetTCPConnection -LocalPort ${DEV_PORT} -State Listen | Select-Object OwningProcess`,
  );
} else if (portError) {
  problems.push(`Could not verify port ${DEV_PORT}: ${portError.message}`);
}

if (problems.length > 0) {
  console.error("\nTaskify development preflight failed:\n");
  for (const problem of problems) console.error(`- ${problem}`);
  console.error();
  process.exit(1);
}

if (freeMemory < RECOMMENDED_FREE_MEMORY) {
  console.warn(
    `Taskify development preflight warning: ${formatGiB(freeMemory)} is free; ${formatGiB(RECOMMENDED_FREE_MEMORY)} or more is recommended.`,
  );
}

console.log(
  `Taskify development preflight passed: Node ${process.versions.node}, port ${DEV_PORT}, ${formatGiB(freeMemory)} free.`,
);
