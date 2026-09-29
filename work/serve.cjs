const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const file=path.join(__dirname,'../outputs/um-corte.html');
const server=http.createServer((req,res)=>{
 if(req.url==='/'||req.url==='/um-corte.html'){
   res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
 }else{res.writeHead(404);res.end('Not found');}
});
server.listen(4173,'127.0.0.1',()=>console.log('UM CORTE: http://127.0.0.1:4173'));
