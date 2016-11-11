/**
 * Some helpers
 * @object
 */
const helpers = {

    /**
     * Create a new DOMParser
     */
    _parser: new DOMParser(),

    /**
     * Return URL parts
     */
    getPath() {
        
        const pathnameParts = window.location.pathname.split('/');
        const pathnameLength = pathnameParts.length;

        return pathnameParts[pathnameLength-1];
        
    },

    /**
     * Uses DOMParser to get some HTML within a certain selector
     */
    parseFromString(string, selector) {
        const html = this._parser.parseFromString(string, 'text/html');
        return html.querySelector(selector).innerHTML;
    }
    
};

export default helpers;