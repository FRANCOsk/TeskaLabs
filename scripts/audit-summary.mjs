import { execFileSync } from "node:child_process";

let auditResult;

try {
  const output = execFileSync("npm", ["audit", "--json"], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  auditResult = JSON.parse(output);
} catch (error) {
  const output = error.stdout?.toString();
  if (!output) {
    console.error(error.stderr?.toString() || error.message);
    process.exit(1);
  }
  auditResult = JSON.parse(output);
}

const vulnerabilities = Object.entries(auditResult.vulnerabilities ?? {})
  .filter(([, vulnerability]) => ["high", "critical"].includes(vulnerability.severity))
  .sort(([left], [right]) => left.localeCompare(right));

if (vulnerabilities.length === 0) {
  console.log("No high or critical npm vulnerabilities found.");
  process.exit(0);
}

console.error(`Found ${vulnerabilities.length} high or critical vulnerable package(s):`);

for (const [name, vulnerability] of vulnerabilities) {
  const causes = (vulnerability.via ?? [])
    .map(cause => typeof cause === "string" ? cause : cause.title ?? cause.name)
    .filter(Boolean)
    .join("; ");

  console.error(`- ${name} [${vulnerability.severity}]`);
  if (causes) {
    console.error(`  via: ${causes}`);
  }
  console.error(`  affected range: ${vulnerability.range}`);
  console.error(`  fix available: ${JSON.stringify(vulnerability.fixAvailable)}`);
}

process.exit(1);
