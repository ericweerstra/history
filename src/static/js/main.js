import HistoryModel from 'history/HistoryModel'
import HistoryView from 'history/HistoryView'
import HistoryController from 'history/HistoryController'

document.addEventListener('DOMContentLoaded', function() {

    // create a Model
    const model = new HistoryModel();

    // create a View
    const view = new HistoryView({
        triggers: document.querySelectorAll('#nav a'),
        loaderElement: document.querySelector('main'), // optional loaderElement for loading state styling, the parentNode is the default
        container: document.querySelector('section'),
        target: 'section',
        transition: { // optional transition properties
            element: document.querySelector('section'),
            property: 'opacity'
        }
    });

    // create a Controller and pass the model and the view
    new HistoryController(model, view);

});