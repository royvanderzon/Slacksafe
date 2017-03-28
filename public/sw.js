// self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
// self.addEventListener('fetch', function(event) {
//     console.log(event.request.url)
//     // event.respondWith(new Response('hijacked'))
// })
console.log('ready to serve!');


self.addEventListener('install', event => event.waitUntil(
    caches.open('slacksafe-core')
        .then(cache => cache.addAll([
            '/offline',
            '/dist/css/styles.min.css',
            '/dist/js/bundle.min.js',
            'https://fonts.googleapis.com/css?family=Roboto'
        ]))
        .then(self.skipWaiting())
));

self.addEventListener('fetch', event => {

	caches.open('slacksafe-pages').then(function(cache){
		// console.log(cache)
	})
	
    // console.log(event)
    const request = event.request;
    if (request.mode === 'navigate') {
    	getAllCachedPages(request)
        event.respondWith(
            fetch(request)
                .then(response => cachePage(request, response))
                .catch(err => getCachedPage(request))
                .catch(err => fetchCoreFile('/offline'))
        );
    } else {
        event.respondWith(
            fetch(request)
                .catch(err => fetchCoreFile(request.url))
                .catch(err => fetchCoreFile('/offline'))
        );
    }
});

function fetchCoreFile(url) {
    return caches.open('slacksafe-core')
        .then(cache => cache.match(url))
        .then(response => response ? response : Promise.reject());
}

function getCachedPage(request) {
	caches.open('slacksafe-pages').then(function(cache){
		// console.log(cache)
	})
    return caches.open('slacksafe-pages')
        .then(cache => cache.match(request))
        .then(response => response ? response : Promise.reject());
}

function cachePage(request, response) {
    const clonedResponse = response.clone();
    caches.open('slacksafe-pages')
        .then(cache => cache.put(request, clonedResponse));
    return response;
}

function getAllCachedPages(request){
	caches.open('slacksafe-pages').then(function(cache){
		// console.log('senddd')
		send_message_to_all_clients(cache)
	})
}

function send_message_to_client(client, msg){
    return new Promise(function(resolve, reject){

        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function(event){
            if(event.data.error){
                reject(event.data.error);
            }else{
                resolve(event.data);
            }
        };

        client.postMessage(JSON.parse(JSON.stringify(msg)), [msg_chan.port2]);
    });
}

function send_message_to_all_clients(msg){
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            send_message_to_client(client, msg).then(m => console.log(m));
        })
    })
}