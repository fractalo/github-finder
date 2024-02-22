import { EventEmitter } from "./EventEmitter.js";

export class Writable extends EventEmitter {
    constructor(defaultValue) {
        super();
        this._value = defaultValue;
    }

    get() {
        return this._value;
    }

    set(value) {
        this._value = value;
        this._emit('update', value);
    }

    subscribe(callback) {
        this.addEventListener('update', callback);
        callback(this._value);
    }
}