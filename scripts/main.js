import { UsersSearch } from "./UsersSearch.js";
import { GithubApiClient } from "./api/GithubApiClient.js";



document.addEventListener('DOMContentLoaded', () => {

    const client = new GithubApiClient();

    const searchUsersInputEl = document.getElementById('search-users-query-input');

    const searchUsersResultsEl = document.getElementById('search-users-results');


    new UsersSearch({
        client,
        inputEl: searchUsersInputEl,
        resultListEl: searchUsersResultsEl,
    });
    

});

