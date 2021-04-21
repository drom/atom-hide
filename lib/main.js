'use strict';

const path = require('path');
const { CompositeDisposable } = require('atom');

const { EditorRegistry } = require('./editor-registry.js');
const Inspector = require('./inspector-view.js');
const Doppler = require('./doppler-view.js');
const schematic = require('./schematic-view.js');
const xmlFinder = require('./xml-finder.js');

module.exports = {

  activate() {
    this.inspector = new Inspector();
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.workspace.getCenter().observeActivePaneItem(item => {
        if (item && item.getDirectoryPath && item.getDirectoryPath()) {
          xmlFinder(
            item.getDirectoryPath(),
            this.inspector.update(this.inspector.getElement())
          );
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add(
        'atom-workspace', {
          'hide-inspect:toggle': () => { this.inspector.toggle(); },
          'hide-inspect:toggle-focus': () => { this.inspector.toggleFocus(); }
        }
      )
    );

    this.subscriptions.add(
      atom.commands.add(
        'atom-text-editor', {
          'hide-schematic:toggle': () => { schematic.toggle(); }
        }
      )
    );

    this.subscriptions.add(
      atom.workspace.addOpener(uri => {
        const base = path.basename(uri).toLowerCase().split('.');
        const c = base.pop();
        const b = base.pop();
        if ((c === 'json5') && (b === 'waves')) {
          return new Doppler(uri);
        }
      })
    );

    this.subscriptions.add(
      atom.workspace.addOpener(uri => {
        const [protocol, path] = uri.split('://');
        if (protocol !== 'hide-schematic') {
          return;
        }

        if (path.startsWith('editor/')) {
          const editorId = parseInt(path.substring(7));
          return new schematic.Schematic({ editorId });
        }
      })
    );

  },

  deactivate() {
    this.subscriptions.dispose();
    this.inspector.destroy();
    this.inspector = null;
  },

  consumeIndie(registerIndie) {
    const linter = registerIndie({
      name: 'HIDE'
    });

    const editorContainer = new EditorRegistry(linter);

    this.subscriptions.add(linter, editorContainer);

    this.subscriptions.add(
      atom.workspace.observeTextEditors(editor => {
        editorContainer.add(editor);
      })
    );
  }

};

/* global atom */
