# Geo-FS Speed Challenges

![Image](https://cdn.discordapp.com/attachments/771661854619205642/992752500048412722/unknown.png)

Geo-FS Speed Challenges is an addon for Geo-FS for parkour challenges. Similar to the ones present in the Top Gun DLC of Microsoft Flight Simulator 2020, the player must pass through waypoints as fast as possible, and as low as possible, in the fastest time. They will get a score at the end based on these three variables. This is only working for Geo-FS 3.X

# **How to use this addon:**

This addon is very easy to use! 
First, you must click on the addon's button on the bottom tab to get the addon's in-game page. You can choose the parkour from the drop-down list. Then, click on the "Load JSON" button to load the parkour into your system. It will display to the player a description of the parkour, as well as its current leaderboard. The next two buttons are "Start challenge" and "Reload challenge". The latter resets everything to zero. "Start challenge" makes the player spawn at the designated position to start the parkour, as well as turn on the looping mechanism. It will also open the Nav tab with the flight path of the parkour pre-entered. 
Timers will start when the player reaches the first waypoint. 
There are several aids for the player: the Nav map, the HSI heading, and the custom model.
The Nav map will display the parkour for the user. The HSI heading, found on the heading indicator on the insturments panel, will show the direction to the next waypoint, while the custom model will simply show the user where the waypoint is.

![Image](https://cdn.discordapp.com/attachments/771661854619205642/992815434250330212/unknown.png)

# **Dev version**

The dev version is basically the same as the normal version, except for some minor differences. Already, the user will not have a drop-down display showing the parkours, but will have an input box where they will be able to put the JSON in. They will also not have any leaderoard.

# **How to create your own parkour**
This Github repo is equipped with several instruments to create your own parkour. I personally use Google Earth Pro too make my coordinates. To start, I create a folder where I will have all my points. 
![Image](https://cdn.discordapp.com/attachments/771661854619205642/992840072573497454/unknown.png)
Once in that folder, I can just simply add all the waypoints in Google Earth with the New Placemark option, represented with a pin in the taskbar. 
![Image](https://cdn.discordapp.com/attachments/771661854619205642/992840802545963110/unknown.png)
The waypoints will be a group of 4 points, directly following eachother, placed in correct geometrical order. When a user will fly inside the 4 points in GeoFS, he will advance to the next waypoint.   Continue to place the points in Google Earth, polygon by polygon. Once the entire plan is done, export it as a .klm file. 
![Image](https://cdn.discordapp.com/attachments/771661854619205642/993059359460446259/unknown.png)
THIS IS IMPORTANT!!! Do not save as a KMZ file, save it as a KML file. Once you saved it, open a XML to JSON converter online. I personally used [this one](https://www.utilities-online.info/xmltojson). Once that is done, Go ahead and use the  [Google Earth to GeoFS.js](https://github.com/TotallyRealElonMusk/Geo-FS-Speed-Challenges/blob/main/dev-version/Google%20Earth%20to%20GeoFS.js) file in this repo, to transform it to a readable JSON file for the game. Paste the entire JSON file in the parkour variable, as well as fill out all the spawn information and description. Once you have the JSON file that resulted from the code, you can use this other file, [JSON Parkour Validator.js](https://github.com/TotallyRealElonMusk/Geo-FS-Speed-Challenges/blob/main/dev-version/JSON%20Parkour%20Validator.js ), also in my repo. Paste the printed JSON file of the other code in the same parkour variable. This script will check the viability of your script, and will enter the waypoint numbers. 
Once that is done, you are given the entire JSON text for Geo-FS. You can now go and test it in the dev version. Once you are assured that it works, send me a message on Discord (Elon Musk#6896) or the Geo-FS Fandom (FakeElonMusk), and if its all seems correct for me, I'll release it publicly on the main version with a leaderboard.
