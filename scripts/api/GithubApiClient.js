
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
                signal: config.signal,
            }
        );

        return response.json();
    }

    async searchUsers(options, signal) {
        return this._callApi('/search/users', 'GET', {
            params: {
                q: options.query,
                page: options.pageNum ?? 1,
                per_page: options.pageSize ?? 30,
            },
            signal,
        });
    }

    async getUser(username) {
        return this._callApi(`/users/${username}`, 'GET');
    }

    async getUserRepositories(username) {
        return this._callApi(`/users/${username}/repos`, 'GET');
    }

}