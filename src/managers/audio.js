import * as THREE from 'three';

export class Audio {
    constructor(filepath, doLoop) {
        console.log("made", filepath);
        this.listener = new THREE.AudioListener();
        this.loader = new THREE.AudioLoader();
        this.sound = new THREE.Audio(this.listener);
        this.loader.load(
            filepath,
            (buffer) => {
                this.sound.setBuffer(buffer);
                this.sound.setLoop(doLoop); 
                this.sound.setVolume(1);
            }
        )
    }

    play() {
        console.log("play called");
        if (this.sound.isPlaying) {
            console.log("Testing: no audio overlap good")
        } else {
            console.log("audio started");
            this.sound.play();
        }
    }

    setVolume(volume) {
        this.sound.setVolume(volume);
    }

    getSound() {
        return this.sound;
    }
}