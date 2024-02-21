
const BASE_URL = 'https://api.github.com';

const HEADERS = {
    accept: 'application/vnd.github+json',
}

export class GithubApiClient {
    constructor() { 
    }

    static async get(url) {
        const response = await this.fetch(
            url,
            {
                headers: HEADERS
            }
        );
        return response.json();
    }

    async _callApi(path, method = 'GET', config = {}) {
        const { params } = config;

        const url = new URL(path, BASE_URL);
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(
            url,
            {
                headers: {
                    ...HEADERS,
                },
                method,
                body: config.body,
            }
        );

        return response.json();
    }

    async searchUsers(query, pageNum = 1, pageSize = 30) {
        const data = await this._callApi('/search/users', 'GET', {
            params: {
                q: query,
                page: pageNum,
                per_page: pageSize,
            }
        });

        return data.items;
    }

    async getUser(username) {
        return this._callApi(`/users/${username}`, 'GET');
    }

    async getUserRepositories(username) {
        return this._callApi(`/users/${username}/repos`, 'GET');
    }

}