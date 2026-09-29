const fs=require('fs'),p=__dirname+'/v5-test.cjs';let s=fs.readFileSync(p,'utf8').replace("stack.includes('attack')?3.9:3","stack.includes('attack')?3*1.3:3");fs.writeFileSync(p,s);
