/**
 * @extends HTMLElement
 */
export default ((base = HTMLElement) => {
  window.svgIconset = window.svgIconset || {};

  customElements.define('custom-svg-iconset', class CustomSvgIconset extends base {
    /**
     * Attributes to observe
     *
     * Updates the js prop value with related attribute value
     * @return {array} ['name', 'theme', size]
     */
    static get observedAttributes() {
      return ['name', 'theme', 'size'];
    }
    /**
     * Runs whenever inserted into document
     */
    constructor() {
      super();
    }
    connectedCallback() {
      if (!this.hasAttribute('name')) {
        this.name = this.name;
      }
      this.style.display = 'none';
    }
    // Getters
    /**
     * The name of the iconset
     * @default {string} icons
     */
    get name() {
      return this._name || 'icons';
    }
    /**
     * The theme for the iconset
     * @default {string} light
     * @return {string}
     */
    get theme() {
      return this._theme || 'light';
    }
    /**
     * The size for the icons
     * @default {number} 24
     * @return {number}
     */
    get size() {
      return this._size || 24;
    }
    // Setters
    /**
     * Creates the iconset[name] in window
     */
    set name(value) {
      if (this._name !== value) {
        this._name = value;
        window.svgIconset[value] = {host: this, theme: this.theme};
        window.dispatchEvent(new CustomEvent('svg-iconset-update'));
        window.dispatchEvent(new CustomEvent('svg-iconset-added', {detail: value}));
      }
    }
    /**
     * Reruns applyIcon whenever a change has been detected
     */
    set theme(value) {
      if (this._theme !== value && this.name) {
        window.svgIconset[this.name] = {host: this, theme: value};
        window.dispatchEvent(new CustomEvent('svg-iconset-update'));
      }
      this._theme = value;
    }
    /**
     * @private
     */
    set size(value) {
      this._size = value;
    }
    /**
     * Runs whenever given attribute in observedAttributes has changed
     * @private
     */
    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal !== newVal) {
        this[name] = newVal;
      }
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
      this._cloneIcon(icon).then(icon => {
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
    _cloneIcon(id) {
      return new Promise((resolve, reject) => {
        // create the icon map on-demand, since the iconset itself has no discrete
        // signal to know when it's children are fully parsed
        try {
          this._icons = this._icons || this._createIconMap();
          let svgClone = this._prepareSvgClone(this._icons[id], this.size);
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
    _createIconMap() {
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
  })
})()
