#!/bin/bash
#切换到项目根目录
cd "$(dirname "$0")"/..
tar --disable-copyfile --exclude='./node_modules' --exclude='./.git' --exclude='./.idea' --exclude='./.vscode' --exclude='./.publish' --exclude='./.gitignore' -zcvf lucky_server.tar.gz .
scp -r lucky_server.tar.gz root@47.101.31.109:/home/application/
