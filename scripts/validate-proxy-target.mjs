import fs from "node:fs";

const compose = fs.readFileSync("docker-compose.yaml", "utf8");
const proxy = fs.readFileSync("desired-state/proxy.yaml", "utf8");
const composeLines = compose.split(/\r?\n/);

if (composeLines.some((line) => /^\s*ports:\s*(?:#.*)?$/.test(line))) {
  throw new Error('docker-compose.yaml must not publish host ports; use expose: ["80"] behind Nginx Proxy Manager');
}

if (!composeLines.some((line) => /^\s*expose:\s*(?:#.*)?$/.test(line)) || !composeLines.some((line) => /^\s*-\s*["']?80["']?\s*(?:#.*)?$/.test(line))) {
  throw new Error("docker-compose.yaml must expose port 80 to the Docker network");
}

if (!/^\s{4}networks:\s*(?:#.*)?$/m.test(compose) || !/^\s{6}dockerwp:\s*(?:#.*)?$/m.test(compose) || !/^\s{4}name:\s*dockerwp\s*(?:#.*)?$/m.test(compose) || !/^\s{4}external:\s*true\s*(?:#.*)?$/m.test(compose)) {
  throw new Error("docker-compose.yaml must attach the site service to the external dockerwp network");
}

const containerMatch = compose.match(/^\s*container_name:\s*([^\r\n#]+)/m);
if (!containerMatch) {
  throw new Error("docker-compose.yaml must define an explicit container_name for the site service");
}

const containerName = containerMatch[1].trim();
const forwardMatches = [...proxy.matchAll(/^\s*forward_host:\s*([^\r\n#]+)/gm)].map((match) => match[1].trim());
if (forwardMatches.length === 0) {
  throw new Error("desired-state/proxy.yaml must define at least one forward_host");
}

const ipLiteral = /^(?:\d{1,3}\.){3}\d{1,3}$/;
for (const forwardHost of forwardMatches) {
  if (ipLiteral.test(forwardHost)) {
    throw new Error(`forward_host must be the Docker container name, not an IP literal: ${forwardHost}`);
  }
  if (forwardHost !== containerName) {
    throw new Error(`forward_host "${forwardHost}" must match docker-compose container_name "${containerName}"`);
  }
}

console.log(`proxy target ok: ${containerName} on dockerwp with exposed port 80`);
