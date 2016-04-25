"use strict";
/**
 * Created by deepak.vishwakarma on 4/25/16.
 */
const rdline = require('readline');
const fs = require('fs');
const mkdirp = require('mkdirp');
const _ = require('nimble');
const touch = require("touch")
const path = require('path');
const cwd = (process.cwd() || __dirname ) ;
class Utility {
    mkdirp(files, callback){
        let that = this;
        let levels = [];
        _.map(files, (file, cb) =>{
            let fileState = that.stats(file);
            let newLevels =[];
            for(let index =0 , levelsCount = levels.length; index < levelsCount && index <fileState.sub; index++){
                newLevels.push(levels[index]);
            }
            levels = newLevels;
            if(fileState.type == "dir"){
                let absPath = that.generateAbsPath(levels, fileState.path);
                mkdirp(absPath, cb);
                levels.push(fileState.path)
            }else{
                let absPath = that.generateAbsPath(levels, fileState.path);
                touch(absPath, cb);
            }
        }, callback);
    }
    stats(path){
        path = path.replace(/[\s]+$/,"");
        let state ={
            type: "file",
            path: path,
            sub: 0
        }
        if(path[path.length -1] === "/"){
            state.type = "dir";
        }
        let subMatch = path.match(/^---+/);
        if(subMatch){
            state.sub = subMatch[0].match(/---/g).length;
            state.path = path.replace(/^---+/,"");
        }
        return state;
    }
    generateAbsPath(levels, file){
        return path.resolve.apply(null,[cwd].concat(levels).concat([file]));
    }
}
const utility = new Utility();
class SBuilder{
    constructor(){
        this.files =[];
    }
    register(configFile, done){
        const rl = rdline.createInterface({
            input: fs.createReadStream(path.resolve(cwd, configFile))
        });
        function start() {
            rl.on('line', (line) => {
                this.files.push(line);
            });
            rl.on('close', ()=>{
                done(null, this.files);
            });
            rl.on('error', (error) =>{
                done(error, []);
            });
        }
        return {
            start:start.bind(this)
        }
    }

}
var sbuilder = new SBuilder();
if(process.argv.length < 3){
    throw new Error("Filename is missing!");
}
sbuilder.register(process.argv[2], (error, files) =>{
    if(error){
        throw error;
    }
    utility.mkdirp(files, (error, results)=>{
        if(error){
            throw error;
        }
    });
}).start();