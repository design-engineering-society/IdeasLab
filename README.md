# IdeasLab

The ideas lab is a MakerSpace project set up by Design Engineering Society.

This repository contains the development code for an IoT security system developed for the Ideas Lab, coded by Joshua Anderson, Hardik Aggarwal, William Kwasi in a team led by Michael Hofmann.

The IoT security system controls the power to the ideas lab devices (e.g. 3d printers, lazer cutter), so that only authorised users can access a given piece of equipment based on whether they've been inducted on the equipment or not. This is achieved by having an ESP8266 powered smart relay switch attached to every piece of equipment in the Ideas Lab. These smart switches communicate with a master device, which can tell what smart switches to turn on and off. Users access the equipment through the master device - they swipe their uni card on a card reader, which loads their information from the Ideas Lab database. From here, they can choose which device they want to use and how long they want to use it for. The master device then communicates with the smart swsitch attached to that piee of equipment to tell it to turn on. In the case of octoprint compatible 3D printers (e.g. Prusa 3), the master device interfaces with a raspberry pi which is connected to each 3D printer via octoprint, where additional functionality can be achieved and info can be gathered.

Below summarises the contents of the 3 broad folders in this repository:


## Device-Master


## ESP8266Main3


## Database Schemas
