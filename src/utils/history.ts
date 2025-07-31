export type HistoryAction = {
  id?: string;
  redo: () => void;
  undo: () => void;
};

export function createHistory(maxSize: number) {
  const history: HistoryAction[] = [];
  let index = -1;

  function add(action: HistoryAction) {
    const currAction = history[index];
    if (action.id && currAction?.id && action.id === currAction.id) {
      currAction.redo = action.redo;
    } else {
      index++;
      history.splice(index, history.length);
      history.push(action);
      if (history.length > maxSize) {
        history.splice(0, 1);
        index--;
      }
    }
  }

  function undo() {
    const action = history[index];
    if (action) {
      action.undo();
      index--;
    }
  }

  function redo() {
    const action = history[index + 1];
    if (action) {
      action.redo();
      index++;
    }
  }

  function clear() {
    history.slice(0, history.length);
    index = -1;
  }

  return { add, clear, redo, undo };
}
