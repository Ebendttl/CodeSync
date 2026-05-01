import * as monaco from 'monaco-editor';
// @ts-ignore
import type { AwarenessUser } from '@codesync/shared-types';

export class RemoteCursorWidget implements monaco.editor.IContentWidget {
  private domNode: HTMLElement;

  constructor(private user: AwarenessUser, private position: monaco.Position) {
    this.domNode = document.createElement('div');
    this.domNode.className = 'remote-cursor-widget';
    this.domNode.style.cssText = `
      position: absolute;
      border-left: 2px solid ${user.color};
      height: 1.2em;
      pointer-events: none;
      z-index: 100;
    `;

    // Nametag floating above cursor
    const label = document.createElement('div');
    label.className = 'remote-cursor-label';
    label.textContent = user.name;
    label.style.cssText = `
      background: ${user.color};
      color: white;
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      position: absolute;
      bottom: 100%;
      left: 0;
      transform: translateY(-2px);
    `;
    this.domNode.appendChild(label);
  }

  getId() { return `remote-cursor-${this.user.id}`; }
  getDomNode() { return this.domNode; }
  getPosition(): monaco.editor.IContentWidgetPosition {
    return {
      position: this.position,
      preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
    };
  }
}
