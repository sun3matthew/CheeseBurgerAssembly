
export class Input {
    static keys = {};
    static Init() {
        document.addEventListener('keydown', (event) => {
            Input.keys[event.key] = true; // Set the key as pressed
        }, false);
        document.addEventListener('keyup', (event) => {
            Input.keys[event.key] = false; // Set the key as released
        }, false);
    }
    static getKey(key) {
        return Input.keys[key] || false;
    }
    static getKeyDown(key) {
        if (Input.keys[key]) {
            Input.keys[key] = false;
            return true;
        }
        return false;
    }
}
