/**
 * @extends HTMLElement
 */
export default ((base = HTMLElement) => {
  globalThis.svgIconset = globalThis.svgIconset || {};

  customElements.define('custom-svg-iconset', class CustomSvgIconset extends base {
    constructor() {
      super();
    }
    connectedCallback() {
      !this.name && this.setAttribute('name', 'icons')
      globalThis.svgIconset[this.name] = this;
      globalThis.dispatchEvent(new CustomEvent('svg-iconset-update'));
      globalThis.dispatchEvent(new CustomEvent('svg-iconset-added', {detail: this.name}));

      this.style.display = 'none';
    }
    /**
     * The name of the iconset
     * @default {string} icons
     */
    get name() {
      return this.getAttribute('name');
    }

    /**
     * The width of the viewBox
     * @default {Number} 24
     */
    get width() {
      return this.getAttribute('width') || 24
    }

    /**
     * The height of the viewBox
     * @default {Number} 24
     */
    get height() {
      return this.getAttribute('height') || 24
    }

    /* from https://github.com/PolymerElements/iron-iconset-svg */
    /**
     * Applies an icon to given element
     * @param {HTMLElement} element the element appending the icon to
     * @param {string} icon The name of the icon to show
     */
    applyIcon(element, icon) {
      element = element.shadowRoot || element;
      this.removeIcon(element);
      this.#cloneIcon(icon).then(icon => {
        element.insertBefore(icon, element.childNodes[0]);
        element._iconSetIcon = icon
      });
    }
    /**
     * Remove an icon from the given element by undoing the changes effected
     * by `applyIcon`.
     *
     * @param {Element} element The element from which the icon is removed.
     */
    removeIcon(element) {
      // Remove old svg element
      element = element.shadowRoot || element;
      if (element._iconSetIcon) {
        element.removeChild(element._iconSetIcon);
        element._iconSetIcon = null;
      }
    }
    /**
     * Produce installable clone of the SVG element matching `id` in this
     * iconset, or `undefined` if there is no matching element.
     *
     * @return {Element} Returns an installable clone of the SVG element
     * matching `id`.
     * @private
     */
    #cloneIcon(id) {
      return new Promise((resolve, reject) => {
        try {
          this._icons = this._icons || this.#createIconMap();
          let svgClone = this.#prepareSvgClone(this._icons[id]);
          resolve(svgClone);
        } catch (error) {
          reject(error);
        }
      });
    }
    // TODO: Update icon-map on child changes
    /**
     * Create a map of child SVG elements by id.
     *
     * @return {!Object} Map of id's to SVG elements.
     * @private
     */
    #createIconMap() {
      var icons = Object.create(null);
      this.querySelectorAll('[id]')
        .forEach(icon => {
          icons[icon.id] = icon;
        });
      return icons;
    }
    /**
     * @private
     */
    #prepareSvgClone(sourceSvg) {
      if (sourceSvg) {
        var content = sourceSvg.cloneNode(true),
            svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            viewBox = content.getAttribute('viewBox') || '0 0 ' + this.width + ' ' + this.height,
            cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';
        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.cssText = cssText;
        svg.appendChild(content).removeAttribute('id');
        return svg;
      }
      return null;
    }
  })
})();
