import * as THREE from 'three';

export class TextureManager {
    static Textures = {};
    static Models = {};

    static Init() {
        const textureLoader = new THREE.TextureLoader();

        TextureManager.Textures = {
            "B": textureLoader.load('../textures/brick.png'),
            "O": textureLoader.load('../textures/oil.png'),
            "G": textureLoader.load('../textures/grill.png'),
            "W": textureLoader.load('../textures/water.png'),
            "S": textureLoader.load('../textures/wood.png'),

            "C1": textureLoader.load('../textures/veggies.png'),
            "C2": textureLoader.load('../textures/salami.png'),

            "P1": textureLoader.load('../textures/lettuce.png'),
            "P2": textureLoader.load('../textures/bread.png'),
            "background": textureLoader.load('../textures/background.png'),
        };

        TextureManager.Models = {
            "Pold": {
                "path": "../../public/models/lettuceold.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": 0,
                "yRotate": Math.PI / -2,
                "zRotate": 0,
                // scale second: RHR - index pointing forward, thumb pointing down
                "xScale": 4,
                "yScale": 3,
                "zScale": 1.5
            },
            "P1": {
                "path": "../../public/models/lettuce.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": 0,
                "yRotate": 0,
                "zRotate": Math.PI / -2,
                // scale second: RHR - index pointing right, thumb pointing you
                "xScale": 5.12,
                "yScale": 7,
                "zScale": 8.3
            },
            "P2": {
                "path": "../../public/models/bread.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": 0,
                "zRotate": 0,
                // scale second: RHR - index pointing down, thumb pointing right
                "xScale": 0.37,
                "yScale": 0.093,
                "zScale": 0.05,
            },
        };

        for (const key in TextureManager.Textures) {
            TextureManager.Textures[key].encoding = THREE.sRGBEncoding;
        }
    }
}