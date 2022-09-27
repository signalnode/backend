export default async (rootDir: string) => {
  for (const moduleName of ['module1']) {
    const module = await import(`${rootDir}/addons/${moduleName}`);
    module.default();
  }
};
