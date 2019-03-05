;
(function () {
    'use strict';

    let form = document.querySelector('.search-form');
    let input = form.querySelector('[type=search]');
    let list = document.querySelector('.user-list');
    let limit = 10;
    let currentPage = 1;
    let range = 5;

    boot();

    function boot() {
        bindEvents();
    };

    function bindEvents() {
        form.addEventListener('submit', e => {
            e.preventDefault();
            let keyword = input.value;
            search(keyword);
        })
    };

    function search(keyword) {
        let http = new XMLHttpRequest();
        http.open('get', `https://api.github.com/search/users?q=${keyword}&page=${currentPage}&per_page=${limit}`);
        http.send();
        http.addEventListener('load', () => {
            //将返回的JSON格式数据解码成JS格式
            let result = JSON.parse(http.responseText);

            pagePlugin.boot({
                selector: '.page',
                limit,
                range,
                currentPage,
                totalPage: result.total_count,
                onChange(page) {
                    if (page == currentPage)
                        return;
                    currentPage = page;
                    search(keyword);
                },
            });
            render(result);
        })
    }

    //渲染请求返回的结果
    function render(result) {
        list.innerHTML = '';
        result.items.forEach(it => {
            let item = document.createElement('div');
            item.classList.add('item');
            item.innerHTML = `
            <div class="avatar">
                <img src="${it.avatar_url}">
            </div>
            <div class="text">
            <div class="name">${it.login}</div>
            <div><a href="${it.html_url}" target="_blank">${it.html_url}</a></div>
            </div>
            `;
            list.appendChild(item);
        });
    }
})()