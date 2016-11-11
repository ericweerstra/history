export default url => {

    return new Promise((resolve, reject) => {

        let request = new XMLHttpRequest();
        request.open('GET', url);

        request.onload = function() {
            if (request.status === 200) {
                resolve(request.response);
            }
            else {
                reject(Error('error code:' + request.statusText));
            }
        };
        request.onerror = function() {
            reject(Error('There was a network error.'));
        };

        request.send();

    });

};