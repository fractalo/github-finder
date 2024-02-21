import { EventEmitter } from "./EventEmitter.js";
import { createMeterialIconEl } from './utils.js';

export class UsersSearchResultList extends EventEmitter {

    constructor(listEl) {
        super();
        this._lastPageNum = 0;
        this._listEl = listEl;
        this._spinnerEl = this._createSpinnerEl();
        this._nextPageButtonEl = this._createNextPageButtonEl();
        this._noSearchResultEl = this._createNoSearchResultEl();
    }

    show() {
        this._listEl.classList.remove('hidden');
    }

    hide() {
        this._listEl.classList.add('hidden');
    }

    setSpinner() {
        if (this._listEl.contains(this._spinnerEl)) return;
        this._listEl.replaceChildren(this._spinnerEl);
    }

    appendSpinner() {
        this._listEl.append(this._spinnerEl);
    }

    appendResults(results, hasNextPage, pageNum) {
        this._lastPageNum = pageNum;
        if (pageNum <= 1) {
            this.clear();
        }
        this._spinnerEl.remove();

        if (!results.length) {
            this._listEl.append(this._noSearchResultEl);
            return;
        }

        results.forEach(result => {
            const resultEl = this._createSearchResultEl(result);
            this._listEl.append(resultEl);
        });

        if (hasNextPage) {
            this._listEl.append(this._nextPageButtonEl);
        }
    }

    clear() {
        this._listEl.replaceChildren();
    }

    _createSearchResultEl(result) {
        const resultEl = document.createElement('div');
        resultEl.classList.add('search-users-result');

        const avatarEl = document.createElement('img');
        avatarEl.classList.add('search-users-result-avatar');
        avatarEl.setAttribute('src', result.avatar_url);
        avatarEl.setAttribute('alt', 'avatar');

        const usernameEl = document.createElement('span');
        usernameEl.classList.add('search-users-result-username');
        usernameEl.textContent = result.login;

        resultEl.append(
            avatarEl,
            usernameEl,
        );

        resultEl.addEventListener('click', () => {
            this._emit('click:user', result.login);
        });
        
        return resultEl;
    }

    _wrapSpecialElement(element) {
        const wrapperEl = document.createElement('div');
        wrapperEl.classList.add('list-item-wrapper');
        wrapperEl.append(element);
        return wrapperEl;
    }

    _createSpinnerEl() {
        const spinnerEl = document.createElement('div');
        spinnerEl.classList.add('spinner');
        return this._wrapSpecialElement(spinnerEl);
    }

    _createNextPageButtonEl() {
        const buttonEl = document.createElement('button');
        buttonEl.classList.add('btn', 'btn-sm', 'btn-circle');

        buttonEl.append(createMeterialIconEl('expand_more'));

        buttonEl.addEventListener('click', () => {
            this._nextPageButtonEl.remove();
            this._emit('click:next-page', this._lastPageNum + 1);
        })

        return this._wrapSpecialElement(buttonEl);
    }

    _createNoSearchResultEl() {
        const messageEl = document.createElement('span');
        messageEl.textContent = '검색결과가 없습니다.'
        return this._wrapSpecialElement(messageEl);
    }
}