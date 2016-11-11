import Observer from 'utils/Observer';
import helpers from 'utils/helpers';

/**
 * Class HistoryController, it controls the view with input from the model.
 * @class
 */
class HistoryController {

    /**
     * Make a new Controller and pass the model and the view.
     * @constructs
     * @param model
     * @param view
     */
    constructor(model, view) {

        this._model = model;
        this._view = view;
        this._transition = this._view.transition;

        this._initialize();

    }

    /**
     * Initialize
     * @private
     */
    _initialize() {

        Observer.subscribe(this._view, 'trigger', elements => this._trigger(elements));

        // push the current state
        const current = this._view.current;
        history.replaceState(current, null, current.url);
        this._model.addItem(current);

        window.addEventListener('popstate', e => this._change(e.state));

    }

    /**
     * Push the url and container to the history object.
     * @param {Object} elements
     * @private
     */
    _trigger(elements) {

        if (elements.url !== helpers.getPath()) {
            history.pushState(elements, null, elements.url);
            this._change(elements);
        }

    }

    /**
     * Handle change
     * @param {Object} elements
     * @private
     */
    _change(elements) {

        // call the change method on the view and wait for it to resolve
        const viewChange = this._view.change().then(() => {
            // if the model needs a request set view state to loading
            if (this._model.request) {
                this._view.addLoader()
            }
        });

        // wait until there is a item from the model and the view is ready
        Promise.all([this._model.getItem(elements), viewChange])
            .then(response => {

                if (this._model.request) {
                    this._view.removeLoader()
                }

                this._view.setContent(response[0]);

                if (this._transition) {
                    this._view.transitionIn();
                }

            });

    }

}

export default HistoryController;