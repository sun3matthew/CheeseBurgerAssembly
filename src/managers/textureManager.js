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
            "B": {
                "path": "../models/buttons/button", // not a complete path, up to user to finish path name
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": Math.PI / -2,
                "zRotate": 0,
                // scale second: RHR - index pointing up, thumb pointing you
                "xScale": 0.036,
                "yScale": 0.036,
                "zScale": 0.036
            },
            "L": {
                "path": "../models/levers/lever", // not a complete path, up to user to finish path name
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": Math.PI / -2,
                "zRotate": 0,
                // scale second: RHR - index pointing up, thumb pointing you
                "xScale": 5,
                "yScale": 5,
                "zScale": 5
            },
            "S": {
                "path": "../models/mug.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": 0,
                "zRotate": 0,
                // scale second: RHR - index pointing up, thumb pointing right
                "xScale": 0.1,
                "yScale": 0.1,
                "zScale": 0.075
            },
            "P": {
                "path": "../models/plate.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": 0,
                "zRotate": 0,
                // scale second: RHR - index pointing up, thumb pointing right
                "xScale": 0.02,
                "yScale": 0.02,
                "zScale": 0.01
            },
            "C1": {
                "path": "../models/cheese.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / -2,
                "yRotate": 0,
                "zRotate": Math.PI / 8,
                // scale second: RHR - index pointing down + slightly left, thumb pointing right + slightly down
                // all scales must be the same due to non-90 degree rotation
                "xScale": 1.75,
                "yScale": 1.75,
                "zScale": 1.75
            },
            "C2": {
                "path": "../models/meat.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": 0,
                "yRotate": 0,
                "zRotate": 0,
                // scale second: RHR - index pointing right, thumb pointing you
                "xScale": 0.19,
                "yScale": 0.19,
                "zScale": 0.19
            },
            "P1": {
                "path": "../models/lettuce.glb",
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
                "path": "../models/bread.glb",
                // rotation first: RHR - index pointing forward, thumb pointing right
                "xRotate": Math.PI / 2,
                "yRotate": 0,
                "zRotate": 0,
                // scale second: RHR - index pointing down, thumb pointing  right
                "xScale": 0.37,
                "yScale": 0.093,
                "zScale": 0.05,
            }
        };

        for (const key in TextureManager.Textures) {
            TextureManager.Textures[key].encoding = THREE.sRGBEncoding;
        }
    }
}