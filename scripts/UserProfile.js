import { activeUserStore } from './stores.js';

export class UserProfile {
    constructor(config) {
        this._client = config.client;
        this._rootEl = config.rootEl;
        this._abortController = new AbortController();

        activeUserStore.subscribe((value) => {
            this.setUser(value);
        });

        this._spinnerEl = this._createSpinnerEl();
    }

    async setUser(username) {
        if (!username) return;

        this.showSpinner();

        this._abortController.abort();
        const abortController = this._abortController = new AbortController();

        try {
            const [ user, repositories ] = await Promise.all([
                this._client.getUser(username, abortController.signal),
                this._client.getUserRepositories({
                    username,
                    type: 'owner',
                    sort: 'updated',
                    order: 'desc',
                }, abortController.signal),
            ]);

            if (abortController.signal.aborted) {
                throw new Error('aborted');
            }

            this._updateUserInfo(user);
            this._updateUserRepositories(repositories);
            this.hideSpinner();

        } catch (error) {
            if (abortController.signal.aborted) {
                return;
            }
            console.error(error);

        }
    }

    show() {
        this._rootEl.classList.remove('transparent');
    }

    hide() {
        this._rootEl.classList.add('transparent');
    }

    showSpinner() {
        this.show();
        this._rootEl.prepend(this._spinnerEl);
    }

    hideSpinner() {
        this._spinnerEl.remove();
    }

    _updateUserInfo(user) {
        const avatarAnchorEl = this._rootEl.querySelector('.user-avatar a');
        avatarAnchorEl.setAttribute('href', user.html_url);
        avatarAnchorEl.setAttribute('target', '_blank');
        avatarAnchorEl.setAttribute('rel', 'noopener noreferrer');

        const avatarImageEl = this._rootEl.querySelector('.user-avatar-image');
        avatarImageEl.setAttribute('src', user.avatar_url);

        const usernameEl = this._rootEl.querySelector('.user-name');
        usernameEl.textContent = user.name ?? user.login;

        const detailsEl = this._rootEl.querySelector('.user-details');

        detailsEl.innerHTML = `
            <div class="user-badges">
                <div class="badge badge-primary">Public Repos: ${user.public_repos ?? ''}</div> 
                <div class="badge badge-primary">Public Gists: ${user.public_gists ?? ''}</div> 
                <div class="badge badge-primary">Followers: ${user.followers ?? ''}</div> 
                <div class="badge badge-primary">Followers: ${user.followers ?? ''}</div> 
            </div>

            <div class="user-detail-list">
                <div class="user-detail-entry">Company: ${user.company ?? ''}</div>
                <div class="user-detail-entry">
                    Website / Blog: 
                    <a href="${user.blog ?? ''}" target="_blank" rel="noopener noreferrer">
                        ${user.blog ?? ''}
                    </a>
                </div>
                <div class="user-detail-entry">Location: ${user.location ?? ''}</div>
                <div class="user-detail-entry">Member Since: ${user.created_at ? new Date(user.created_at).toLocaleString() : ''}</div>
            </div>
        `;
    }

    _updateUserRepositories(repos) {
        const listEl = this._rootEl.querySelector('.repository-list');

        listEl.replaceChildren(
            ...repos.map(repo => this._createRepositoryEl(repo))
        );
    }

    _createRepositoryEl(repo) {
        const repoEl = document.createElement('div');
        repoEl.classList.add('repository');

        repoEl.innerHTML = `
            <div class="repository-titles">
                <a class="repository-name" href="${repo.html_url ?? ''}" target="_blank" rel="noopener noreferrer">
                    ${repo.name}
                </a>
                <div class="repository-description">
                    ${repo.description ?? ''}
                </div>
            </div>
            <div class="repository-badges">
                <div class="badge">Stars: ${repo.stargazers_count}</div>
                <div class="badge">Watchers: ${repo.watchers_count}</div>
                <div class="badge">Forks: ${repo.forks_count}</div>
            </div>
        `;

        return repoEl;
    }

    _createSpinnerEl() {
        const coverEl = document.createElement('div');
        coverEl.classList.add('cover');

        const spinnerEl = document.createElement('div');
        spinnerEl.classList.add('spinner', 'spinner-lg');

        coverEl.append(spinnerEl);
        return coverEl;
    }
}