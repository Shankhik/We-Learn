import pack from './package.json' with {type:'json'}
import {spawn} from 'child_process'
import path from 'path';

const ver = pack.version;
const args = process.argv.slice(2);

// dev or production mode command?
const inDevelopment = args.find(arg => arg===('--dev'))

// Welcome Console
const [r,g,b]= [105,209,192]
const wrap = (text)=>{
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`
}
console.log(
    `<----<----<----<----  `+
    `🎗️  We Learn (ver ${wrap(ver)})${inDevelopment? ' [dev]':''}`+
    `  ---->---->---->---->\n`
)

const devPort = 3000;
const nextPath= path.resolve("node_modules/.bin/next");

const command = inDevelopment?['dev', '-p', devPort]:['start']
const nextDev = spawn(
    nextPath,command,{
        stdio: 'inherit', // Pipe stdout/stderr to parent console
        //shell: true       // Required on Windows for built-in commands
    }
);

nextDev.on('error', (err) => {
    console.error('❌ Failed to start We-Learn: \n', err.message);
});

nextDev.on('exit', (code) => {
    console.log(`📦 We-Learn exited with code ${code}`);
});