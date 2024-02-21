
const BASE_URL = 'https://api.github.com';


export class Github {
    constructor() { 
    }

    async _callApi(path, method, config) {
        const { params } = config;

        const url = new URL(path, BASE_URL);
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(
            url,
            {
                headers: {
                    accept: 'application/vnd.github+json',
                },
                method,
                body: config.body,
            }
        );

        return response.json();
    }

    async searchUsers(query, pageNum = 1, pageSize = 30) {
        return this._callApi('/search/users', 'GET', {
            params: {
                query,
                page: pageNum,
                per_page: pageSize,
            }
        });
    }

    async getUser(username) {
        return this._callApi(`/users/${username}`, 'GET');
    }

}