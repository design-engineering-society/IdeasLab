# IdeasLab

The ideas lab is a MakerSpace project set up by Design Engineering Society.

This repository contains the development code for an IoT security system developed for the Ideas Lab, coded by Joshua Anderson, Hardik Aggarwal, William Kwasi in a team led by Michael Hofmann.

The IoT security system controls the power to the ideas lab devices (e.g. 3d printers, lazer cutter), so that only authorised users can access a given piece of equipment based on whether they've been inducted on the equipment or not. This is achieved by having an ESP8266 powered smart relay switch attached to every piece of equipment in the Ideas Lab. These smart switches communicate with a master device, which can tell what smart switches to turn on and off. Users access the equipment through the master device - they swipe their uni card on a card reader, which loads their information from the Ideas Lab database. From here, they can choose which device they want to use and how long they want to use it for. The master device then communicates with the smart swsitch attached to that piee of equipment to tell it to turn on. In the case of octoprint compatible 3D printers (e.g. Prusa 3), the master device interfaces with a raspberry pi which is connected to each 3D printer via octoprint, where additional functionality can be achieved and info can be gathered.

Below summarises the contents of the 3 broad folders in this repository:


## Device-Master
The device master folder contains all the code which runs the master device. **Index.js** is the hub for all of the code, using ExpressJS to route to all pages and communicate with the external database. The code is then split into 4 main folders:

### User
Code for the user facing side of the master device, such as choosing equipment and uploading 3D printer files

### Operator
Code for the operator facing side of the master device, such as debugging ESP8266 smart switches, viewing and editing the configuration of equipment / switches, and altering user previleges

### Shared
Code which is shared between the user and operator sides, such as the table structurig code

### Helper
Code which contains helper/utility functions that are used throughout the program


## ESP8266Main3
The ESP8266 Smart Switch folder contains all the code which is run on the smart switches. The code is written in C++ using the Arduino IDE. A USB-to-serial adapter is then used to deploy the Arduino code on to the ESP8266.


## Database Schemas
This folder contains the planned schemas for the databases further development. The fields in these json files are a suggestions on what information is required to operate the IoT security system
