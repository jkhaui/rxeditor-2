import { observable, action } from 'mobx';

class ComponentsStore {
  @observable contextMenuState = false;
  @action toggleContextMenuState = () =>
    this.contextMenuState = !this.contextMenuState;

  @observable rightDrawerVisible = false;
  @action toggleRightDrawerVisible = () =>
    this.rightDrawerVisible = !this.rightDrawerVisible;

  @observable keyboardShortcutsVisible = false;
  @action toggleKeyboardShortcutsVisible = () =>
    this.keyboardShortcutsVisible = !this.keyboardShortcutsVisible;
}

const componentsStore = new ComponentsStore();

export { componentsStore };
