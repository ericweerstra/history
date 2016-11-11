import Observer from 'utils/Observer';
import Transition from 'motion/Transition';
import helpers from 'utils/helpers';

/**
 * Class HistoryView which is controlled by the HistoryController.
 * @class
 */
class HistoryView {

    /**
     * Make a new HistoryView.
     * @constructs
     * @param options
     */
    constructor(options) {

        this._options = options;
        this._loadingClassName = 'loading';

        // optional loader element, otherwise use the containers parentNode
        this._loaderElement = this._options._loaderElement || this._options.container.parentNode;

        // create transition if specified
        if (this._options.transition) {
            this._transition = new Transition(this._options.transition.element, this._options.transition.property);
        }

        // listen if one of the triggers/links get clicked
        this._options.triggers.forEach(trigger => trigger.addEventListener('click', e => this._trigger(e)));

    }

    /**
     * Publish a trigger event through the Observer if one one the triggers gets clicked on.
     * @param e
     * @private
     */
    _trigger(e) {

        e.preventDefault();

        // publish the href and the target element
        Observer.publish(this, 'trigger', {
            url: e.target.getAttribute('href'),
            target: this._options.target
        });

    }

    /**
     * Get the current page
     * @public
     */
    get current() {
        return {
            url: helpers.getPath(),
            content: this._options.container.innerHTML
        };
    }

    /**
     * Expose the transition.
     * @public
     */
    get transition() {
        return this._transition;
    }

    /**
     * Add the loading CSS class to the loader element.
     * @public
     */
    addLoader() {
        this._loaderElement.classList.add(this._loadingClassName);
    }

    /**
     * Remove the loading CSS class from the loader element.
     * @public
     */
    removeLoader() {
        this._loaderElement.classList.remove(this._loadingClassName);
    }

    /**
     * Add the content to the container element.
     * @public
     * @param {String} content
     */
    setContent(content) {
        this._options.container.innerHTML = content;
    }

    /**
     * Change method that is called by the controller after change. It returns the optional transition of immediately resolves.
     * @public
     */
    change() {
        if (this._transition) {
            return this._transition.out();
        }
        return Promise.resolve();
    }

    /**
     * Transition in method, returns a Promise so the controller knows when it's finished.
     * @public
     */
    transitionIn() {
        return this._transition.in();
    }

}

export default HistoryView;