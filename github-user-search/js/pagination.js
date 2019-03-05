;
(function () {
    'use strict';

    window.pagePlugin = {
        boot,
        render,
    };

    let config;

    //默认配置
    const DEFAULT_CONFIG = {
        limit: 10,
        currentPage: 1,
        range: 10,
    };

    /**
     * @param {Object} user_config
     * selector 确定插件加载位置
     * limit 每页显示条数限制
     * range 显示的页码数量
     * currentPage 当前页
     * totalPage 返回的数据总条数
     * onChange() 翻页时的回调函数
     */
    function boot(user_config) {
        //合并配置项
        config = {
            ...DEFAULT_CONFIG,
            ...user_config,
        };

        let state = {
            config,
        };

        state.currentPage = config.currentPage;

        prepare(state);
        render(state);
        bindEvents(state);
    };

    //设置基本模板
    function prepare(state) {
        let el = document.createElement('div');
        el.classList.add('.page-Plugin');
        el.innerHTML = `
        <span class="shortcuts">
            <button class="first-page">首页</button>
            <button class="prev-page">上一页</button>
        </span>
        <span class="page-list"></span>
        <span class="shortcuts">
            <button class="next-page">下一页</button>
            <button class="last-page">末页</button>
        </span>
        `;
        state.root = document.querySelector(state.config.selector);
        state.el = el;
        state.pageList = el.querySelector('.page-list');
        state.root.innerHTML = '';
        state.root.appendChild(el);
    };

    //计算页面数量并渲染
    function render(state) {
        // GitHub Only the first 1000 search results are available
        if (state.config.totalPage < 1000) {
            state.pageCount = Math.ceil(state.config.totalPage / state.config.limit);
        } else {
            state.pageCount = 100
        }

        let list = state.pageList;
        list.innerHTML = '';

        let current = state.currentPage;
        let halfRange = Math.floor(state.config.range / 2);
        let start = current - halfRange;
        let end = current + halfRange;

        if (start < 1) {
            start = 1;
            end = start + 2 * halfRange;
        };
        if (end > state.pageCount) {
            end = state.pageCount;
            start = end - 2 * halfRange;
        };
        if (state.pageCount <= state.config.range) {
            start = 1;
            end = state.pageCount;
        }

        for (let i = start; i <= end; i++) {
            let page = i;
            let button = document.createElement('button');
            button.classList.add('page-button');

            if (state.currentPage === page) {
                button.classList.add('active');
            };
            button.innerText = page;
            button.$page = page;
            state.pageList.appendChild(button);
        };
        state.buttons = state.pageList.querySelectorAll('.page-button');
    };

    //绑定按钮事件
    function bindEvents(state) {
        state.el.addEventListener('click', e => {
            let page = e.target.$page;
            let klass = e.target.classList;

            if (page)
                setCurrentPage(state, page);

            if (klass.contains('prev-page'))
                setCurrentPage(state, state.currentPage - 1);

            if (klass.contains('next-page'))
                setCurrentPage(state, state.currentPage + 1);

            if (klass.contains('first-page'))
                setCurrentPage(state, 1);

            if (klass.contains('last-page'))
                setCurrentPage(state, state.pageCount);
        })
    };

    //切换页面
    function setCurrentPage(state, page) {
        if (page < 1)
            return setCurrentPage(state, 1);

        if (page > state.pageCount) {
            alert("没有更多了")
            return setCurrentPage(state, state.pageCount);
        }

        state.currentPage = page;
        let onChange = state.config.onChange;

        if (onChange) {
            onChange(page, state);
        };
        render(state);
    }

})();