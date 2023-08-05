import { EventBus } from '@signalnode/types';
import EventEmitter from 'events';
import { Device } from '../models/device.model';
import { History } from '../models/history.model';

const emitter = new EventEmitter();

export const eventBus = (deviceId: string): EventBus => ({
  emit: (propertyName, value) => {
    emitter.emit('*', deviceId, propertyName, value);
    emitter.emit(`${deviceId}.${propertyName}`, value);

    saveValue(deviceId, propertyName, value);
  },
  on: (eventName, listener) => {
    emitter.on(eventName, listener);
  },
});

const saveValue = async (deviceId: string, propertyName: string, value: unknown) => {
  try {
    const device = await Device.findOne({ where: { uniqueId: deviceId }, relations: ['properties'] });
    const property = device?.properties?.find((property) => property.name === propertyName);
    if (property) {
      property.value = value as string;
      property.save();

      if (property.useHistory) {
        History.from({ value, property }).save();
      }
    }
  } catch (e) {
    console.error(e);
  }
};
