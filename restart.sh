#!/bin/bash
if  pgrep node > /dev/null
then
	pkill node && screen -L -dmS gold node app.js &
else 
	screen -L -dmS gold node app.js &
fi

