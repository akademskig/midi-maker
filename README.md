# Midi maker

## Local Installation

### Requirements

- make sure you have > Node 8 installed.

### Commands

```sh

# In both root directory and client directory, run:
npm install && npm run build

#In the root directory, run the command below to make Tone.js usable by Node.js
sed -e 's/window/global/' -i ./node_modules/@tonejs/midi/build/Midi.js

# To install required linux packages, run:
apt-get update && apt-get install -y apt-utils timidity lame fluid-soundfont-gm
sed -e 's|^source|#source|' -e '$a source /etc/timidity/fluidr3_gm.cfg' -i /etc/timidity/timidity.cfg && \
    /etc/init.d/timidity start

# Create directory to store midi files
mkdir midis

# Finally, start the app:
npm start
```
## Using docker

### Requirements

- make sure you have docker installed
  
### Commands

```
# Build and run docker container

docker build . -t midimaker
docker run -p 4321:4321 midimaker

# Open browser on port 4321

```
