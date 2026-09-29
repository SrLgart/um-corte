'use strict';
const path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
// Packaging only. Regenerating engine/integration is an explicit separate step.
const result=spawnSync(process.execPath,[path.join(root,'work/v8/build.cjs'),path.join(root,'build')],{cwd:root,stdio:'inherit'});
if(result.error)throw result.error;
process.exitCode=result.status??1;
