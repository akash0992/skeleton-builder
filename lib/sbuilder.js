#!/usr/bin/env node

"use strict";
/**
 * Created by deepak.vishwakarma on 4/25/16.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var rdline = require('readline');
var fs = require('fs');
var _mkdirp = require('mkdirp');
var _ = require('nimble');
var touch = require("touch");
var path = require('path');
var cwd = process.cwd() || __dirname;

var Utility = function () {
    function Utility() {
        _classCallCheck(this, Utility);
    }

    _createClass(Utility, [{
        key: 'mkdirp',
        value: function mkdirp(files, callback) {
            var that = this;
            var levels = [];
            _.map(files, function (file, cb) {
                var fileState = that.stats(file);
                var newLevels = [];
                for (var index = 0, levelsCount = levels.length; index < levelsCount && index < fileState.sub; index++) {
                    newLevels.push(levels[index]);
                }
                levels = newLevels;
                if (fileState.type == "dir") {
                    var absPath = that.generateAbsPath(levels, fileState.path);
                    _mkdirp(absPath, cb);
                    levels.push(fileState.path);
                } else {
                    var _absPath = that.generateAbsPath(levels, fileState.path);
                    touch(_absPath, cb);
                }
            }, callback);
        }
    }, {
        key: 'stats',
        value: function stats(path) {
            path = path.replace(/[\s]+$/, "");
            var state = {
                type: "file",
                path: path,
                sub: 0
            };
            if (path[path.length - 1] === "/") {
                state.type = "dir";
            }
            var subMatch = path.match(/^---+/);
            if (subMatch) {
                state.sub = subMatch[0].match(/---/g).length;
                state.path = path.replace(/^---+/, "");
            }
            return state;
        }
    }, {
        key: 'generateAbsPath',
        value: function generateAbsPath(levels, file) {
            return path.resolve.apply(null, [cwd].concat(levels).concat([file]));
        }
    }]);

    return Utility;
}();

var utility = new Utility();

var SBuilder = function () {
    function SBuilder() {
        _classCallCheck(this, SBuilder);

        this.files = [];
    }

    _createClass(SBuilder, [{
        key: 'register',
        value: function register(configFile, done) {
            var rl = rdline.createInterface({
                input: fs.createReadStream(path.resolve(cwd, configFile))
            });
            function start() {
                var _this = this;

                rl.on('line', function (line) {
                    _this.files.push(line);
                });
                rl.on('close', function () {
                    done(null, _this.files);
                });
                rl.on('error', function (error) {
                    done(error, []);
                });
            }
            return {
                start: start.bind(this)
            };
        }
    }]);

    return SBuilder;
}();

var sbuilder = new SBuilder();
if (process.argv.length < 3) {
    throw new Error("Filename is missing!");
}
sbuilder.register(process.argv[2], function (error, files) {
    if (error) {
        throw error;
    }
    utility.mkdirp(files, function (error, results) {
        if (error) {
            throw error;
        }
    });
}).start();