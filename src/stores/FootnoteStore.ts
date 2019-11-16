import { observable, action } from 'mobx';

class FootnoteStore {
  @observable count = 1;
  @action incrementCount = () => this.count = this.count + 1;

  @observable footnoteJustAdded = true;
  @action setFootnoteJustAdded = (state: boolean) =>
    this.footnoteJustAdded = state;
}

const footnoteStore = new FootnoteStore();

export { footnoteStore };