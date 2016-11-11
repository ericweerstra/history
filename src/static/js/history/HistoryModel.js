import request from 'data/request';
import helpers from 'utils/helpers';

/**
 * The Model checks if there's a item stored, if not it requests and stores the item.
 * @class
 */
class HistoryModel {

    /**
     * Construct the Model
     * @constructs
     */
    constructor() {
        this._items = [];
        this._request = false;
    }

    /**
     * Get the stored item or through a request.
     * @param {Object} options
     */
    getItem(options) {

        // check if the item is allready stored
        const item = this._items.find(item => item.url === options.url);

        // item found, nog request needed so Resolve
        if (item) {

            this._request = false;
            return Promise.resolve(item.content);

        }
        // no item, request one and store it
        else {

            return request(options.url).then(response => {

                this._request = true;
                // get the content part we need
                const content = helpers.parseFromString(response, options.target);
                this.addItem({ url: options.url, content: content });

                return content;

            });

        }

    }

    /**
     * Expose if there's a request needed
     * @public
     */
    get request() {
        return this._request;
    }

    /**
     * Add item to items array
     * @public
     * @param {Object} item
     */
    addItem(item) {
        this._items.push(item);
    }

}

export default HistoryModel;