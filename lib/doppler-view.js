'use strict';

const path = require('path');
const json5 = require('json5');
const { CompositeDisposable, File } = require('atom');
const { dom, vcd2obj, getWaves } = require('@wavedrom/doppler');

module.exports = class Doppler {
  constructor(filePath) {
    this.file = new File(filePath);
    this.element = document.createElement('div');
    this.element.classList.add('wavedrom', 'doppler');
    this.element.setAttribute('style', 'height:100%;');
    this.update(this.element)(this.file);
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(this.file.onDidDelete(() => {
      const pane = atom.workspace.paneForURI(filePath);
      try {
        pane.destroyItem(pane.itemForURI(filePath));
      } catch (e) {
        console.warn(`Could not destroy pane after external file was deleted: ${e}`);
      }
      this.subscriptions.dispose();
    }));
    this.subscriptions.add(
      atom.commands.add(
        '.wd-container',
        // this.element,
        {
          'doppler:plus': () => console.log('++++++++++++++'),
          'doppler:minus': () => console.log('--------------')
        }
      )
    );
  }

  getTitle() {
    const filePath = this.getURI();
    if (filePath) {
      return path.basename(filePath);
    }
    return 'untitled';
  }

  destroy () {
    this.subscriptions.dispose();
    this.element.remove();
  }

  getURI () {
    return this.file.getPath();
  }

  // Register a callback for when the image file changes
  onDidChange (callback) {
    const changeSubscription = this.file.onDidChange(callback);
    this.subscriptions.add(changeSubscription);
    return changeSubscription;
  }

  // Register a callback for whne the image's title changes
  onDidChangeTitle (callback) {
    const renameSubscription = this.file.onDidRename(callback);
    this.subscriptions.add(renameSubscription);
    return renameSubscription;
  }

  update(element) {
    return async wavesFile => {
      const wavesStr = await wavesFile.read();
      const waves = json5.parse(wavesStr);
      if (waves.vcd) {
        const vcdPath = path.resolve(
          path.dirname(wavesFile.getPath()),
          waves.vcd
        );
        const vcdFile = new File(vcdPath);
        const strm = vcdFile.createReadStream();
        vcd2obj(strm, obj => {
          obj.view = getWaves(obj, waves.waves);
          dom.container(element, obj);
        });
      } else {
        console.error('no vcd file reference in the waves file');
        console.error(waves);
      }
    };
  }

};

/* eslint-env browser */
/* global atom */
