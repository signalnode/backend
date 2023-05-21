import { EventBus } from '@signalnode/types';
import EventEmitter from 'events';

const emitter = new EventEmitter();

export const eventBus = (deviceId: string): EventBus => ({
  emit: (key, value) => {
    emitter.emit('*', deviceId, key, value);
    emitter.emit(`${deviceId}.${key}`, value);
  },
  on: (eventName, listener) => {
    emitter.on(eventName, listener);
  },
});
