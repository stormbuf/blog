var fs = require('fs');
var path = require('path');

//解析需要遍历的文件夹，我这以E盘根目录为例
var filePath = path.resolve('./docs');


function fileDisplay(filePath){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                console.log('遍历到的目录: '+filename);
                //获取当前文件的绝对路径
                var filedir = path.join(filePath,filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror,stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            var patt = /^.*.md$/
                            if(patt.test(filedir)){
                                fs.appendFile(filedir, "\n<Vssue/>",'utf8',function(err){
                                    if (err) {
                                        console.log("追加数据失败"+err)
                                    } else {
                                        console.log("追加数据成功"+filedir)
                                    }
                                });
                            }
                        }
                        if(isDir){
                            console.log(filedir);
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

//调用文件遍历方法
fileDisplay(filePath);