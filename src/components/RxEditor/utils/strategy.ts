import {
  IEntityStrategyContentBlock,
  IEntityStrategyContentState,
} from '../../../types/rxEditor';

export const entityStrategy = (type: string) => (
  contentBlock: IEntityStrategyContentBlock,
  callback: any,
  contentState: IEntityStrategyContentState,
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    if (entityKey === null) {
      return false;
    }
    return contentState.getEntity(entityKey).getType() as any === type;
  }, callback);
};
