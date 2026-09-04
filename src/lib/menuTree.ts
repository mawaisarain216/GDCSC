import type { MenuItem } from "./types";

export interface MenuNode extends MenuItem {
  children: MenuNode[];
}

export function buildMenuTree(items: MenuItem[]): MenuNode[] {
  const byId = new Map<string, MenuNode>();
  items.forEach((i) => byId.set(i.id, { ...i, children: [] }));
  const roots: MenuNode[] = [];
  byId.forEach((node) => {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots.sort((a, b) => a.order_num - b.order_num);
}
