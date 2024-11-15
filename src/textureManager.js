import * as THREE from 'three';

export class TextureManager {
    static TileTextures = [];
    static ObjectTextures = {}; // Dictionary

    static Init() {
        const textureLoader = new THREE.TextureLoader();

        TextureManager.TileTextures = [
            textureLoader.load('../assets/brick.png'),
            textureLoader.load('../assets/oil.png'), 
            textureLoader.load('../assets/grill.png'),
            textureLoader.load('../assets/water.png'),
        ];

        for (let i = 0; i < TextureManager.TileTextures.length; i++) {
            TextureManager.TileTextures[i].encoding = THREE.sRGBEncoding;
        }

        TextureManager.ObjectTextures = {
            "player1": textureLoader.load('../assets/lettuce.png'),
            "player2": textureLoader.load('../assets/bread.png'),
            "background": textureLoader.load('../assets/background.png'),
        };

        for (const key in TextureManager.ObjectTextures) {
            TextureManager.ObjectTextures[key].encoding = THREE.sRGBEncoding;
        }
    }
}