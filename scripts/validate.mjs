import {readFile} from "node:fs/promises";

const file=new URL("../data/programs.json",import.meta.url);
const data=JSON.parse(await readFile(file,"utf8"));
const required=["state","program","status","opens","deadline","funding","max_award","match","eligible","mapping_signal","source_title","source_url","last_verified"];
const allowed=new Set(["open","closing-soon","upcoming","awarded","award-watch","watch"]);
const seen=new Set();

if(!Array.isArray(data.programs)||data.programs.length<1)throw new Error("programs must be a non-empty array");
for(const [index,program] of data.programs.entries()){
  for(const field of required){if(!program[field])throw new Error(`program ${index+1} is missing ${field}`);}
  if(!allowed.has(program.status))throw new Error(`program ${index+1} has an unknown status`);
  if(!program.source_url.startsWith("https://"))throw new Error(`program ${index+1} needs an HTTPS source`);
  const key=`${program.state}|${program.program}`;
  if(seen.has(key))throw new Error(`duplicate program: ${key}`);
  seen.add(key);
}
console.log(`Validated ${data.programs.length} source-linked programs.`);
