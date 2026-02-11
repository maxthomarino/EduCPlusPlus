import type { ParsedFile, SidebarModule, SidebarSubfolder, SidebarFile } from "./types.js";

export function buildSidebarData(files: ParsedFile[]): SidebarModule[] {
  const moduleMap = new Map<string, SidebarModule>();

  for (const file of files) {
    let mod = moduleMap.get(file.moduleName);
    if (!mod) {
      mod = {
        name: file.moduleName,
        title: file.moduleTitle,
        order: file.moduleOrder,
        subfolders: [],
      };
      moduleMap.set(file.moduleName, mod);
    }

    let sub = mod.subfolders.find((s) => s.name === file.subfolder);
    if (!sub) {
      sub = { name: file.subfolder, files: [] };
      mod.subfolders.push(sub);
    }

    sub.files.push({
      fileName: file.fileName,
      shortTitle: file.header.shortTitle,
      slug: file.slug,
    });
  }

  // Sort modules by order, subfolders alphabetically, files alphabetically
  const modules = Array.from(moduleMap.values());
  modules.sort((a, b) => a.order - b.order);
  for (const mod of modules) {
    mod.subfolders.sort((a, b) => a.name.localeCompare(b.name));
    for (const sub of mod.subfolders) {
      sub.files.sort((a, b) => a.fileName.localeCompare(b.fileName));
    }
  }

  return modules;
}
