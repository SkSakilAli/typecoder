const code = {
    0: `import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import execa from 'execa'
import { NEXT_DIR, logCommand, execFn } from './pack-util'
export default async function buildNative(
  buildNativeArgs: string[]
): Promise<void> {
const buildCommand = ['pnpm', 'run', 'build-native', ...buildNativeArgs]
logCommand('Build native bindings', buildCommand)
await execa(buildCommand[0], buildCommand.slice(1), {
cwd: nextSwcDir,
shell: true,
env: {
NODE_ENV: process.env.NODE_ENV,
CARGO_TERM_COLOR: 'always',
 TTY: '1',
 },
stdio: 'inherit',
})
await execFn(
'Copy generated types to next/src/build/swc/generated-native.d.ts,
() => writeTypes()
)
}

// Check if this file is being run directly
if (import.meta.url === url.pathToFileURL(process.argv[1]).toString()) {
buildNative(process.argv.slice(2)).catch((err) => {
console.error(err)
process.exit(1)
})
}
async function writeTypes() {
const generatedTypesPath = path.join(
NEXT_DIR,
'packages/next-swc/native/index.d.ts'
)
const vendoredTypesPath = path.join(
NEXT_DIR,
'packages/next/src/build/swc/generated-native.d.ts'
 )
const generatedTypesMarker = '// GENERATED-TYPES-BELOW\n'
const generatedNotice =
'// DO NOT MANUALLY EDIT THESE TYPES\n' +
'// You can regenerate this file by running pnpm swc-build-native in the root of the repo.\n\n'
const generatedTypes = await fs.readFile(generatedTypesPath, 'utf8')
let vendoredTypes = await fs.readFile(vendoredTypesPath, 'utf8')
vendoredTypes = vendoredTypes.split(generatedTypesMarker)[0]
vendoredTypes =
 vendoredTypes + generatedTypesMarker + generatedNotice + generatedTypes
await fs.writeFile(vendoredTypesPath, vendoredTypes)
const prettifyCommand = ['prettier', '--write', vendoredTypesPath]
logCommand('Prettify generated types', prettifyCommand)
await execa(prettifyCommand[0], prettifyCommand.slice(1), {
cwd: NEXT_DIR,
stdio: 'inherit',
preferLocal: true,
})
}`,

    1: `const fs = require('fs')
const path = require('path')
const globOrig = require('glob')
const { promisify } = require('util')
const glob = promisify(globOrig)
function collectPaths(routes, paths = []) {
for (const route of routes) {
if (route.path && !route.redirect) {
paths.push(route.path)
}
if (route.routes) {
collectPaths(route.routes, paths)
}
}
}
async function main() {
const manifest = 'errors/manifest.json'
let hadError = false
const dir = path.dirname(manifest)
const files = await glob(path.join(dir, '**/*.md'))
const manifestData = JSON.parse(await fs.promises.readFile(manifest, 'utf8'))
const paths = []
collectPaths(manifestData.routes, paths)
const missingFiles = files.filter(
(file) => !paths.includes(/file) && file !== 'errors/template.md'
)
if (missingFiles.length) {
hadError = true
console.log(Missing paths in manifest}:missingFiles.join(''))
} else {
console.log(No missing paths in manifest)
}
for (const filePath of paths) {
if (
!(await fs.promises
.access(path.join(process.cwd(), filePath), fs.constants.F_OK)
.then(() => true)
.catch(() => false))
) {
console.log('Could not find path:', filePath)
hadError = true
}
}
if (hadError) {
throw new Error('missing/incorrect manifest items detected see above')
}
}
main()
  .then(() => console.log('success'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })`,

    2: `const authToken = process.env.CODE_FREEZE_TOKEN
if (!authToken) {
throw new Error("missing CODE_FREEZE_TOKEN env")
}
const codeFreezeRule = {
context: 'Potentially publish release',
app_id: 15368,
}
async function updateRules(newRules) {
const res = await fetch(
"https://api.github.com/repos/vercel/next.js/branches/canary/protection",
{
method: 'PUT',
headers: {
Accept: 'application/vnd.github+json',
Authorization: "Bearer  authToken",
'X-GitHub-Api-Version': '2022-11-28',
},
body: JSON.stringify(newRules),
}
)
if (!res.ok) {
throw new Error(
"Failed to check for rule res.status} await res.text()}"
)
}
}
async function getCurrentRules() {
const res = await fetch(
"https://api.github.com/repos/vercel/next.js/branches/canary/protection",
{
headers: {
Accept: 'application/vnd.github+json',
Authorization: "Bearer authToken",
'X-GitHub-Api-Version': '2022-11-28',
},
}
)
if (!res.ok) {
throw new Error(
"Failed to check for rule $res.status $await res.text()"
)
const data = await res.json()
return {
required_status_checks: {
strict: data.required_status_checks.strict,
// checks: data.required_status_checks.checks,
contexts: data.required_status_checks.contexts,
},
enforce_admins: data.enforce_admins.enabled,
required_pull_request_reviews: {
dismiss_stale_reviews:
data.required_pull_request_reviews.dismiss_stale_reviews,
require_code_owner_reviews:
data.required_pull_request_reviews.require_code_owner_reviews,
require_last_push_approval:
data.required_pull_request_reviews.require_last_push_approval,
required_approving_review_count:
data.required_pull_request_reviews.required_approving_review_count,
},
restrictions: {
users: data.restrictions.users?.map((user) => user.login) || [],
teams: data.restrictions.teams?.map((team) => team.slug) || [],
apps: data.restrictions.apps?.map((app) => app.slug) || [],
},
}
}
async function main() {
const typeIdx = process.argv.indexOf('--type')
const type = process.argv[typeIdx + 1]
if (type !== 'enable' && type !== 'disable') {
throw new Error("--type should be enable or disable")
}
const isEnable = type === 'enable'
const currentRules = await getCurrentRules()
const hasRule = currentRules.required_status_checks.contexts?.some((ctx) => {
return ctx === codeFreezeRule.context
})
console.log(currentRules)
if (isEnable) {
if (hasRule) {
console.log("Already enabled")
return
}
currentRules.required_status_checks.contexts.push(codeFreezeRule.context)
await updateRules(currentRules)
console.log('Enabled code freeze')
} else {
if (!hasRule) {
console.log("Already disabled")
      return
}
currentRules.required_status_checks.contexts =
currentRules.required_status_checks.contexts.filter(
(ctx) => ctx !== codeFreezeRule.context)
await updateRules(currentRules)
console.log('Disabled code freeze')
}
}
main().catch((err) => {
console.error(err)
process.exit(1)
})`,

};
function random(number) {
    return Math.trunc(Math.random() * number);
}

const randomNumber = random(2);
const randomCodeC = code[randomNumber];

export { randomCodeC };

