import * as THREE from 'three';

export class TextureManager {
    static Textures = {};

    static Init() {
        const textureLoader = new THREE.TextureLoader();

        TextureManager.Textures = {
            "B": textureLoader.load('../textures/brick.png'),
            "O": textureLoader.load('../textures/oil.png'),
            "G": textureLoader.load('../textures/grill.png'),
            "W": textureLoader.load('../textures/water.png'),
            "S": textureLoader.load('../textures/wood.png'),

            "P1": textureLoader.load('../textures/lettuce.png'),
            "P2": textureLoader.load('../textures/bread.png'),
            "background": textureLoader.load('../textures/background.png'),
        };

        for (const key in TextureManager.Textures) {
            TextureManager.Textures[key].encoding = THREE.sRGBEncoding;
        }
    }
}