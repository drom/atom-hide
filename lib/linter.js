'use strict';

const { CompositeDisposable } = require('atom');

const svlinter = require('svlint/lib/linter.js');

module.exports = class Linter {

  constructor (editor, linterInterface) {
    this.editor = editor;
    this.linterInterface = linterInterface;
    this.textDisposables = new CompositeDisposable();
    this.textDisposables.add(
      editor.buffer.onDidStopChanging((/* event */) => this.lint())
    );
    this.initialLint(this, 10);
  }

  initialLint (self, remainingAttempts) {
    if (!self.lint() && remainingAttempts > 0) {
      setTimeout(self.initialLint, 1000, self, remainingAttempts - 1);
    }
  }

  remove () {
    if (this.filePath) {
      this.linterInterface.setMessages(this.filePath, []);
    }
    this.textDisposables.dispose();
  }

  lint () {
    this.filePath = this.editor.getPath();
    if (!this.editor.alive || !this.filePath) { return; } // AFAIK the linter package itself only works with an existing path

    this.lintMessages = [];
    const tree = this.editor.languageMode.tree;
    if (!tree) {
      return false;
    }

    console.log(tree.rootNode);

    svlinter(
      tree.rootNode,
      (node, severity, excerpt) => this.messenger(node, severity, excerpt)
    );

    const injectionMarkers = this.editor.languageMode.injectionsMarkerLayer.findMarkers({});

    for (const injectionMarker of injectionMarkers) {
      const tree = injectionMarker.languageLayer.tree;
      if (tree) {
        svlinter(
          tree.rootNode,
          (node, severity, excerpt) => this.messenger(node, severity, excerpt)
        );
      }
    }

    this.linterInterface.setMessages(this.filePath, this.lintMessages);
    return true;
  }

  messenger (node, severity, excerpt) {
    this.lintMessages.push({
      severity, // error, warning
      location: {
        file: this.filePath,
        position: [node.startPosition, node.endPosition]
      },
      excerpt
    });
  }

};
