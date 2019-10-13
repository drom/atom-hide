'use strict';

const { CompositeDisposable } = require('atom');

const { EditorRegistry } = require('./editor-registry.js');

module.exports = {

  activate() {
    this.disposables = new CompositeDisposable();
  },

  deactivate() {
    this.disposables.dispose();
  },

  consumeIndie(registerIndie) {
    const linter = registerIndie({
      name: 'IDE-EDA'
    });

    const editorContainer = new EditorRegistry(linter);

    this.disposables.add(linter, editorContainer);

    this.disposables.add(
      atom.workspace.observeTextEditors(editor => {
        editorContainer.add(editor);
      })
    );
  }
};
