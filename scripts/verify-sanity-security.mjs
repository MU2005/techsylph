import { readFileSync, existsSync } from "fs";

function loadEnv(path) {
  const env = {};
  if (!existsSync(path)) return env;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv(".env.local");
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = env.SANITY_API_TOKEN;

if (!projectId) {
  console.log("missing_project_id");
  process.exit(1);
}

const dataUrl =
  `https://${projectId}.api.sanity.io/v2021-10-21/data/query/${dataset}` +
  `?query=${encodeURIComponent('count(*[_type=="inquiry"])')}`;

const mgmtProjectUrl = `https://api.sanity.io/v2021-06-07/projects/${projectId}`;
const mgmtCorsUrl = `https://api.sanity.io/v2021-06-07/projects/${projectId}/cors`;
const mgmtDatasetsUrl = `https://api.sanity.io/v2021-06-07/projects/${projectId}/datasets`;
const mgmtGrantsUrl = `https://api.sanity.io/v2021-06-07/projects/${projectId}/grants`;

async function getStatus(url, authToken) {
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  const res = await fetch(url, { headers });
  let body = "";
  try {
    body = await res.text();
  } catch {
    body = "";
  }
  return { status: res.status, body };
}

const noAuthData = await getStatus(dataUrl);
const tokenData = token ? await getStatus(dataUrl, token) : { status: -1, body: "missing token" };
const tokenMgmtProject = token
  ? await getStatus(mgmtProjectUrl, token)
  : { status: -1, body: "missing token" };
const tokenMgmtCors = token
  ? await getStatus(mgmtCorsUrl, token)
  : { status: -1, body: "missing token" };
const tokenMgmtDatasets = token
  ? await getStatus(mgmtDatasetsUrl, token)
  : { status: -1, body: "missing token" };
const tokenMgmtGrants = token
  ? await getStatus(mgmtGrantsUrl, token)
  : { status: -1, body: "missing token" };

console.log(
  JSON.stringify(
    {
      projectId,
      dataset,
      checks: {
        dataQueryNoAuth: noAuthData.status,
        dataQueryWithToken: tokenData.status,
        managementProjectWithToken: tokenMgmtProject.status,
        managementCorsWithToken: tokenMgmtCors.status,
        managementDatasetsWithToken: tokenMgmtDatasets.status,
        managementGrantsWithToken: tokenMgmtGrants.status,
      },
      snippets: {
        dataQueryNoAuth: noAuthData.body.slice(0, 200),
        managementProjectWithToken: tokenMgmtProject.body.slice(0, 200),
        managementCorsWithToken: tokenMgmtCors.body.slice(0, 200),
        managementDatasetsWithToken: tokenMgmtDatasets.body.slice(0, 200),
        managementGrantsWithToken: tokenMgmtGrants.body.slice(0, 200),
      },
    },
    null,
    2
  )
);
