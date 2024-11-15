
export class Input {
    static keys = {};
    static Init() {
        document.addEventListener('keydown', (event) => {
            console.log(event.key);
            Input.keys[event.key] = true; // Set the key as pressed
        }, false);
        document.addEventListener('keyup', (event) => {
            Input.keys[event.key] = false; // Set the key as released
        }, false);
    }
    static getKey(key) {
        return Input.keys[key] || false;
    }
}
