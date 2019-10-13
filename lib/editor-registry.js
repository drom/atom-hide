'use strict';

const { CompositeDisposable } = require('atom');

const Linter = require('./linter.js');

/*
* This class is responsible for managing which editors
* get the linting. It will observe text editor creation,
* as well as grammar changes in these text editors.
*/
class EditorRegistry {
  constructor(linterInterface) {
    this.linterInterface = linterInterface;
    this.editorDataByID = new Map();
  }

  add(editor) {
    if (this.has(editor)) { return; }

    let lifeCycleDisposables = new CompositeDisposable();

    this.editorDataByID.set(editor.id, {
      editor,
      lifeCycleDisposables,
      subscribed: false
    });

    lifeCycleDisposables.add(

      editor.observeGrammar(grammar => {
        let subscribed = this.isSubscribed(editor);
        let container = this.get(editor);

        let isTreeSitter = isTreeSitterGrammar(grammar);

        if (isTreeSitter && !subscribed) {
          this.addSubscription(container, editor);
        } else if (!isTreeSitter && subscribed) {
          this.removeSubscription(container, editor);
        }
      }),

      editor.onDidDestroy(() => {
        this.remove(editor);
      })

    );
  }

  isSubscribed(editor) {
    return this.has(editor) && this.get(editor).subscribed;
  }

  addSubscription(container, editor) {
    if (container.subscribed) { console.log("already subscribed!"); return; }

    container.linter = new Linter(editor, this.linterInterface);
    container.subscribed = true;
  }

  removeSubscription(container, editor) {
    if (!container.subscribed) { return; }

    container.linter.remove();
    container.subscribed = false;
  }

  has(editor) {
    return this.editorDataByID.has(editor.id);
  }

  get(editor) {
    return this.editorDataByID.get(editor.id);
  }

  remove(editor) {
    if (!this.has(editor)) { return; }
    const container = this.get(editor);

    container.lifeCycleDisposables.dispose();
    this.removeSubscription(container, editor);

    this.editorDataByID.delete(editor.id);
  }

  dispose() {
    for (let [id, container] of this.editorDataByID) {
      container.lifeCycleDisposables.dispose();
      if (container.linter) { container.linter.remove(); }
    }
  }
}

function isTreeSitterGrammar(grammar) {
  return grammar.constructor.name === "TreeSitterGrammar";
}

module.exports = { EditorRegistry };
