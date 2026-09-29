const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'../../outputs/um-corte-v3.html');
http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/'||url.pathname==='/um-corte-v3.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);}else{res.writeHead(404);res.end('Not found');}}).listen(4175,'127.0.0.1',()=>console.log('UM CORTE V3: http://127.0.0.1:4175'));

