// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];
let articles = JSON.parse(localStorage.getItem('articles')) || [];

export function configureFakeBackend() {
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        const { method, headers } = opts;
        const body = opts.body && JSON.parse(opts.body);

        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && method === 'POST':
                        return authenticate();
                    case url.endsWith('/users/register') && method === 'POST':
                        return register();
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser();
                    case url.endsWith('/articles/add') && method === 'POST':
                        return addArticle();
                    case url.endsWith('/articles') && method === 'GET':
                        return getArticles();
                    case url.match(/\/articles\/\d+$/) && method === 'DELETE':
                        return deleteArticle();
                    case url.match(/\/articles\/\d+$/) && method === 'GET':
                        return getArticleById();
                        case url.match(/\/articles\/\d+$/) && method === 'PUT':
                        return updateArticle();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body;
                const user = users.find(x => x.username === username && x.password === password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                });
            }

            function register() {
                const user = body;
    
                if (users.find(x => x.username === user.username)) {
                    return error(`Username  ${user.username} is already taken`);
                }
    
                // assign user id and a few other properties then save
                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }
    
            function getUsers() {
                if (!isLoggedIn()) return unauthorized();

                return ok(users);
            }
    
            function deleteUser() {
                if (!isLoggedIn()) return unauthorized();
    
                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem('users', JSON.stringify(users));
                return ok();
            }

            // Article functions

            function addArticle() {
                const item = body;

                // if (users.find(x => x.username === item.username)) {
                //     return error(`Article  ${item.username} is already taken`);
                // }

                // assign user id and a few other properties then save
                item.id = articles.length ? Math.max(...articles.map(x => x.id)) + 1 : 1;
                articles.push(item);
                localStorage.setItem('articles', JSON.stringify(articles));

                return ok();
            }

            function updateArticle() {
                const item = body;
                console.log("articles.find(x => x.id === idFromUrl())");
                console.log(articles.find(x => x.id === idFromUrl()));

                console.log(articles.findIndex(x => x.id === idFromUrl()));
                const index = articles.findIndex(x => x.id === idFromUrl());
                if (articles.find(x => x.id === idFromUrl())) {
                    articles[index] = item;
                    localStorage.setItem('articles', JSON.stringify(articles));

                    return ok(articles);
                }

                else{
                    return error('The article you are trying to update does not exist');
                }
                // assign user id and a few other properties then save
                // item.id = articles.length ? Math.max(...articles.map(x => x.id)) + 1 : 1;
                // articles.push(item);

            }

            function getArticles() {
                if (!isLoggedIn()) return unauthorized();

                return ok(articles);
            }

            function getArticleById() {
                if (!isLoggedIn()) return unauthorized();
                let article = articles.filter(x => x.id === idFromUrl());
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(article[0])) });
                // return ok(articles);
            }

            function deleteArticle() {
                if (!isLoggedIn()) return unauthorized();

                articles = articles.filter(x => x.id !== idFromUrl());
                console.log(idFromUrl());
                console.log(articles);
                localStorage.setItem('articles', JSON.stringify(articles));
                return ok(articles);
            }

            // End Article functions

            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function isLoggedIn() {
                return headers['Authorization'] === 'Bearer fake-jwt-token';
            }
    
            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }
        });
    }
}
