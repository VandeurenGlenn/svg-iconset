var customSvgIconSet = (function () {
'use strict';

var customSvgIconset = ((base = HTMLElement) => {
  window.svgIconset = window.svgIconset || {};
  customElements.define('custom-svg-iconset', class CustomSvgIconset extends base {
    static get observedAttributes() {
      return ['name', 'theme', 'size'];
    }
    constructor() {
      super();
    }
    connectedCallback() {
      if (!this.hasAttribute('name')) {
        this.name = this.name;
      }
      this.style.display = 'none';
    }
    get name() {
      return this._name || 'icons';
    }
    get theme() {
      return this._theme || 'light';
    }
    get size() {
      return this._size || 24;
    }
    set name(value) {
      if (this._name !== value) {
        this._name = value;
        window.svgIconset[value] = { host: this, theme: this.theme };
        window.dispatchEvent(new CustomEvent('svg-iconset-update'));
        window.dispatchEvent(new CustomEvent('svg-iconset-added', { detail: value }));
      }
    }
    set theme(value) {
      if (this._theme !== value && this.name) {
        window.svgIconset[this.name] = { host: this, theme: value };
        window.dispatchEvent(new CustomEvent('svg-iconset-update'));
      }
      this._theme = value;
    }
    set size(value) {
      this._size = value;
    }
    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal !== newVal) {
        this[name] = newVal;
      }
    }
    applyIcon(element, icon) {
      element = element.shadowRoot || element;
      this.removeIcon(element);
      this._cloneIcon(icon).then(icon => {
        element.insertBefore(icon, element.childNodes[0]);
        element._iconSetIcon = icon;
      });
    }
    removeIcon(element) {
      element = element.shadowRoot || element;
      if (element._iconSetIcon) {
        element.removeChild(element._iconSetIcon);
        element._iconSetIcon = null;
      }
    }
    _cloneIcon(id) {
      return new Promise((resolve, reject) => {
        try {
          this._icons = this._icons || this._createIconMap();
          let svgClone = this._prepareSvgClone(this._icons[id], this.size);
          resolve(svgClone);
        } catch (error) {
          reject(error);
        }
      });
    }
    _createIconMap() {
      var icons = Object.create(null);
      this.querySelectorAll('[id]').forEach(icon => {
        icons[icon.id] = icon;
      });
      return icons;
    }
    _prepareSvgClone(sourceSvg, size) {
      if (sourceSvg) {
        var content = sourceSvg.cloneNode(true),
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            viewBox = content.getAttribute('viewBox') || '0 0 ' + size + ' ' + size,
            cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.cssText = cssText;
        svg.appendChild(content).removeAttribute('id');
        return svg;
      }
      return null;
    }
  });
})();

return customSvgIconset;

}());
//# sourceMappingURL=custom-svg-iconset.js.map
