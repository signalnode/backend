import { SignalNodeServiceManager } from '@signalnode/types';
import cron, { ScheduledTask } from 'node-cron';

const services: { [key: string]: ScheduledTask[] } = {};

export const serviceManager = (deviceId: string): SignalNodeServiceManager => ({
  registerService: (service, interval) => {
    const task = cron.schedule(interval.join(' '), service);
    services[deviceId] ? services[deviceId].push(task) : (services[deviceId] = [task]);
  },
});
