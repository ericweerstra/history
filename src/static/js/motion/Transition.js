/**
 * Class adds CSS transition to an Element.
 * @class
 */
class Transition {

    /**
     * Construct
     * @constructs
     * @param {Object} element
     * @param {String} className
     */
    constructor(element, property, className = 'transition') {
        this._element = element;
        this._property = property;
        this._className = className;
    }

    /**
     * Add the CSS transition className
     * @public
     */
    out() {
        this._element.classList.add(this._className);
        return this._transition();
    }

    /**
     * Remove the CSS transition className
     * @public
     */
    in() {
        this._element.classList.remove(this._className);
        return this._transition();
    }

    /**
     * Promise that listens to trantion end and checks the prop before it resolves.
     * @private
     */
    _transition() {
        return new Promise((resolve, reject) => {
            this._element.addEventListener('transitionend', e => {
                if (e.propertyName === this._property) {
                    resolve();
                }
            });
        });
    }

}

export default Transition;