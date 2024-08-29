#!/bin/bash
cd /home/ec2-user/myapp
pm2 start app.js --name "myapp"
pm2 save
