import { execSync } from 'child_process';
import path from 'path';
import { Addon, AddonModel } from '../models/addon';

type Module = {
  name: string;
  setup: () => void;
  getDetails: () => AddonModel;
  getSettings: () => object[];
};

type ModuleHandler = {
  [uuid: string]: Module;
};

class ModuleManager {
  private modulehandler: ModuleHandler;

  constructor() {
    this.modulehandler = {};
  }

  private load = async (name: string) => {
    return await import(path.resolve('./', 'node_modules', name));
  };

  public install = async (name: string) => {
    try {
      execSync(`npm link ${name}`, {
        stdio: [0, 1, 2],
        // cwd: path.resolve('./', 'src', 'addons'),
      });

      const module = await this.load(name);
      const details = module.getDetails();
      const settings = module.getSettings();
      this.modulehandler[details.uuid] = module;

      Addon.create({ ...details, config: settings });
    } catch (err) {
      // TODO: Handle exception
    }
  };

  public deinstall = (name: string) => {
    execSync(`npm remove ${name}`, { stdio: [0, 1, 2] });
  };

  public initialize = async (name: string) => {
    const module = await this.load(name);
    this.modulehandler[module.getDetails().uuid] = module;
  };

  public getModule = (uuid: string) => this.modulehandler[uuid];
  public getAllModules = () => this.modulehandler;
}

export default new ModuleManager();
