
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
        const params = config.params ?? {};

        const url = new URL(path, BASE_URL);
        Object.entries(params).forEach(([name, value]) => {
            if (value !== undefined) {
                url.searchParams.set(name, value);
            }
        });

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
                sort: options.sort,
                order: options.order,
                page: options.pageNum ?? 1,
                per_page: options.pageSize ?? 30,
            },
            signal,
        });
    }

    async getUser(username, signal) {
        return this._callApi(`/users/${username}`, 'GET', { signal });
    }

    async getUserRepositories(options, signal) {
        return this._callApi(`/users/${options.username}/repos`, 'GET', { 
            params: {
                type: options.type,
                sort: options.sort,
                direction: options.order,
                page: options.pageNum ?? 1,
                per_page: options.pageSize ?? 30,
            },
            signal,
        });
    }

}