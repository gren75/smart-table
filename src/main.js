import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page) || 1;

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    
    const fullState = {
        ...state,
        rowsPerPage: state.rowsPerPage,
        page: state.page
    };
    
    let result = [...data];
    
    // @todo: использование
    // ПРИМЕНЯЕМ МОДУЛИ В ПРАВИЛЬНОМ ПОРЯДКЕ:
    result = applySearching(result, fullState, action);   // 1. СНАЧАЛА ПОИСК
    result = applyFiltering(result, fullState, action);   // 2. ПОТОМ ФИЛЬТРАЦИЯ
    result = applySorting(result, fullState, action);     // 3. ПОТОМ СОРТИРОВКА
    result = applyPagination(result, fullState, action);  // 4. В КОНЦЕ ПАГИНАЦИЯ

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], // <-- ДОБАВЛЯЕМ 'search' В НАЧАЛО
    after: ['pagination']
}, render);

// @todo: инициализация

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация фильтрации
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        searchBySeller: indexes.sellers
    }
);


const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
