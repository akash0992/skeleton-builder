# Skeleton Builder
An app skeleton builder, build app skeleton based path provided in config file

##Prerequisite
>node 4.4.3 or higher, supports es6(Just for now)

##Internal Dependencies
1.  nimble, small utility library
2.  touch, small library to create file
3.  mkdirp, small library to create directory

##How to Install
```bash
$npm install -g skeleton-builder
```

##How to use
```
#create a config file with all file name and folder
#example.txt
components/
---Loader.react.js
---NotificationBar.react.js
---Tweet.react.js
---Tweets.react.js
---TweetsApp.react.js
models/
---Tweet.js
```
```bash
#run
$skeleton-builder example.txt
```

##Syntax helper
```
Path with "/" at the end, indicates current path is directory/folder
Without "/" at the end, indicates current path is file
```

