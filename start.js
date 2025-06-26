import pack from './package.json' with {type:'json'}
import {spawn} from 'child_process'
import path from 'path';

const ver = pack.version;
const args = process.argv.slice(2);

const inDevelopment = args.find(arg => arg===('--dev'))

const [r,g,b]= [105,209,192]

const wrap = (text)=>{
    return `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`
}
console.log(
    `<----<----<----<----  `+
    `🎗️  We Learn (ver ${wrap(ver)})${inDevelopment? ' [dev]':''}`+
    `  ---->---->---->---->\n`
)
const nextPath= path.resolve("node_modules/.bin/next");

const nextDev = spawn(nextPath, [inDevelopment? 'dev': 'start'], {
    stdio: 'inherit', // Pipe stdout/stderr to parent console
    shell: true       // Required on Windows for built-in commands
});

nextDev.on('error', (err) => {
    console.error('❌ Failed to start We-Learn: \n', err.message);
});

nextDev.on('exit', (code) => {
    console.log(`📦 We-Learn exited with code ${code}`);
});