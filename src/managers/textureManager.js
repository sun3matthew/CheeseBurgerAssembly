import * as THREE from 'three';

export class TextureManager {
    static Textures = {};

    static Init() {
        const textureLoader = new THREE.TextureLoader();

        TextureManager.Textures = {
            "B": textureLoader.load('../assets/textures/brick.png'),
            "O": textureLoader.load('../assets/textures/oil.png'),
            "G": textureLoader.load('../assets/textures/grill.png'),
            "W": textureLoader.load('../assets/textures/water.png'),

            "P1": textureLoader.load('../assets/textures/lettuce.png'),
            "P2": textureLoader.load('../assets/textures/bread.png'),
            "background": textureLoader.load('../assets/textures/background.png'),
        };

        for (const key in TextureManager.Textures) {
            TextureManager.Textures[key].encoding = THREE.sRGBEncoding;
        }
    }
}