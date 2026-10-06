import { spawn } from 'node:child_process';
const commands = [['--watch','server/rooms.mjs'],['node_modules/vite/bin/vite.js','--host','0.0.0.0','--strictPort']];
const children=commands.map(args=>spawn(process.execPath,args,{stdio:'inherit',env:process.env}));
let stopping=false;
const stop=(code=0)=>{if(stopping)return;stopping=true;children.forEach(child=>child.kill('SIGTERM'));process.exitCode=code;};
children.forEach(child=>{child.on('error',()=>stop(1));child.on('exit',(code)=>{if(!stopping)stop(code??1);});});
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
