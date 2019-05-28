FROM node:8

RUN apt-get update && apt-get install -y apt-utils timidity lame fluid-soundfont-gm
RUN sed -e 's|^source|#source|' -e '$a source /etc/timidity/fluidr3_gm.cfg' -i /etc/timidity/timidity.cfg && \
    /etc/init.d/timidity start

WORKDIR /usr/src/midi-maker

COPY package*.json ./

COPY . .

RUN npm install && \
    npm run build && \
    mkdir midis

RUN sed -e 's/window/global/' -i ./node_modules/@tonejs/midi/build/Midi.js

WORKDIR /usr/src/midi-maker/client
COPY client/package*.json ./

COPY client ./

RUN npm install && \
    npm run build

WORKDIR /usr/src/midi-maker

EXPOSE 4321
CMD [ "npm", "start" ]
