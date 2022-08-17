export default async () => {
  for (const moduleName of ['module1']) {
    const module = await import(`../addons/${moduleName}`);
    module.default();
  }
}