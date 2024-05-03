import type { DropdownItem } from "#ui/types/dropdown";

export type MenuItemDivider = {
  type: "divider";
};
export type MenuItemLink = {
  type: "link";
  label: string;
  icon?: string;
  to: string;
};

export type MenuItemAction = {
  type: "action";
  label: string;
  icon?: string;
  action: () => void;
};

export type MenuItemOptions = {
  type: "options";
  label: string;
  icon?: string;
  items: DropdownItem[];
};

export type MenuItem = MenuItemDivider | MenuItemLink | MenuItemAction | MenuItemOptions;

export type MenuPosition = { x: number; y: number };

const items = ref<MenuItem[]>([]);
const position = ref<MenuPosition | null>(null);

export const useContextMenu = () => {
  const visible = computed(() => items.value.length > 0 && position.value !== null);

  /**
   * Show menu at cursor position
   * @param {MouseEvent} event The mouse event
   * @param {MenuItem[]} menuItems The menu items to show
   */
  const show = (event: MouseEvent, menuItems: MenuItem[]) => {
    showAt({ x: event.clientX, y: event.clientY }, menuItems);
  };

  /**
   * Show menu at the given position
   * @param {MenuPosition} pos The position to show the menu at
   * @param {MenuItem[]} menuItems The menu items to show
   */
  const showAt = (pos: MenuPosition, menuItems: MenuItem[]) => {
    position.value = pos;
    items.value = menuItems;
  };

  /**
   * Hide the menu
   */
  const hide = () => {
    items.value = [];
    position.value = null;
    onHide();
  };

  const onHide = () => {};

  return {
    items,
    position,
    visible,
    show,
    showAt,
    hide,
    onHide,
  };
};
