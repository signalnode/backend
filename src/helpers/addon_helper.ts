import { SignalNodeAddon, SignalNodeAddonTask, SignalNodeProperty } from '@signalnode/types';
import { execSync } from 'child_process';
import fs from 'fs';
import cron from 'node-cron';
import path from 'path';
import { Property } from '../models/property.model';
import { History } from '../models/history.model';
import { PackageJson } from '../types/package-json';
import TaskManager from './task_manager';

export const installAddon = (name: string) => {
  try {
    // TODO: Remove type linking for production
    execSync(`npm link ${name} @signalnode/types`, {
      stdio: [0, 1, 2],
      // cwd: path.resolve('./', 'src', 'addons'),
    });
  } catch (err) {
    // TODO: Handle exception
    console.error(err);
  }
};

export const deinstallAddon = (name: string) => {
  execSync(`npm remove ${name}`, { stdio: [0, 1, 2] });
};

export const getAddon = async (name: string): Promise<SignalNodeAddon<unknown, string>> => {
  return (await import(path.resolve('./', 'node_modules', name))).default;
};

export const getAddonDetails = (name: string): PackageJson => {
  return JSON.parse(fs.readFileSync(path.resolve('./', 'node_modules', name, 'package.json'), { encoding: 'utf-8' }));
};

export const registerAddonTasks = (addonName: string, tasks: SignalNodeAddonTask<unknown, string>[], config: unknown, immediately?: boolean) => {
  // for (const task of tasks) {
  //   const interval = task.interval.join(' ');
  //   // cron.validate(interval); // TODO: Exit when interval is not vaild
  //   const scheduledTask = cron.schedule(
  //     interval,
  //     async () => {
  //       const data = await task.run(config);

  //       const keys = Object.keys(data);
  //       for (const key of keys) {
  //         const property = await Property.findOneBy({ name: key, addon: { name: addonName } });

  //         if (property?.useHistory) property.history?.push(History.from({ value: property.value, unit: property.unit, property }));
  //         property!.value = data[key];
  //         await property!.save();
  //       }
  //     },
  //     { scheduled: immediately ?? false }
  //   );
  //   TaskManager.add(addonName, scheduledTask);
  // }

  tasks.forEach((task) => {
    const interval = task.interval.join(' ');
    // cron.validate(interval); // TODO: Exit when interval is not vaild
    const scheduledTask = cron.schedule(
      interval,
      async () => {
        const data = await task.run(config);
        Object.keys(data).forEach(async (key) => {
          const property = await Property.findOneBy({ name: key, addon: { name: addonName } });
          if (property?.useHistory) History.from({ value: data[key], unit: property.unit, property }).save();
          property!.value = data[key];
          property!.save();
        });
      },
      { scheduled: immediately ?? false }
    );
    TaskManager.add(addonName, scheduledTask);
  });
};

export const registerPropertyTasks = (addonName: string, properties: SignalNodeProperty<unknown, string>[], config: unknown, immediately?: boolean) => {
  properties.forEach((property) => {
    if (property.task) {
      const interval = property.task.interval.join(' ');
      // cron.validate(interval); // TODO: Exit when interval is not vaild
      const scheduledTask = cron.schedule(
        interval,
        async () => {
          const data = await property.task!.run(config);
          const dbProperty = await Property.findOneBy({ name: property.name, addon: { name: addonName } });
          if (property?.useHistory) dbProperty!.history?.push(History.from({ value: property.value, unit: property.unit, property: dbProperty! }));
          dbProperty!.value = data;
          dbProperty!.save();
        },
        { scheduled: immediately ?? false }
      );
      TaskManager.add(addonName, scheduledTask);
    }
  });
};

export const startTasks = (name: string) => {
  TaskManager.get(name).forEach((task) => task.start());
};

export const stopTasks = (name: string) => {
  TaskManager.get(name).forEach((task) => task.stop());
};
