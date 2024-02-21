import { UsersSearchResultList } from "./UsersSearchResultList.js";

const PAGE_SIZE = 25;

export class UsersSearch {
    constructor(config) {
        this._client = config.client;
        this._inputEl = config.inputEl;
        this._resultListEl = config.resultListEl;
        this._resultList = new UsersSearchResultList(config.resultListEl);
        this._abortController = new AbortController();
        this._init();
    }

    _init() {
        let timeout;
        this._inputEl.addEventListener('input', () => {
            window.clearTimeout(timeout);
            if (!this._inputEl.value) {
                return this._resultList.hide();
            }
            
            this._resultList.show();
            this._resultList.setSpinner();

            timeout = window.setTimeout(() => {
                this.searchUsers();
            }, 500);
        });

        this._inputEl.addEventListener('focus', () => {
            if (!this._inputEl.value) return;
            this._resultList.show();
        });

        this._resultList.addEventListener('click:next-page', (pageNum) => {
            this._resultList.appendSpinner();
            this.searchUsers(pageNum);
        });

        document.addEventListener('mousedown', (event) => {
            if (
                event.target instanceof Node && 
                !this._inputEl.contains(event.target) &&
                !this._resultListEl.contains(event.target) 
            ) {
                this._resultList.hide();
            }
        });
    }

    async searchUsers(pageNum = 1) {
        this._abortController.abort();
        const abortController = this._abortController = new AbortController();

        const query = this._inputEl.value;
        if (!query) return;

        try {
            const data = await this._client.searchUsers({
                query, 
                pageNum, 
                pageSize: PAGE_SIZE,
            }, abortController.signal);

            if (abortController.signal.aborted) {
                throw new Error('aborted');
            }

            const {
                total_count,
                incomplete_results,
                items,
            } = data;

            const hasNextPage = !incomplete_results && pageNum * PAGE_SIZE < total_count;

            this._resultList.appendResults(items, hasNextPage, pageNum);

        } catch (error) {
            if (abortController.signal.aborted) {
                return;
            }
            console.error(error);
        }
    }

}