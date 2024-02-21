export class EventEmitter {
    constructor() {
        this._handlersByEvent = {};
    }

    addEventListener(event, handler) {
        const handlers = this._handlersByEvent[event] ?? [];
        handlers.push(handler);
        this._handlersByEvent[event] = handlers;
    }

    removeEventListener(event, handler) {
        const handlers = this._handlersByEvent[event];
        const newHandlers = handlers.filter(_handler => _handler !== handler);
        this._handlersByEvent[event] = newHandlers;
    }

    _emit(event, ...args) {
        this._handlersByEvent[event]?.forEach(handler => handler(...args));
    }
}