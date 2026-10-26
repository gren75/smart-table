import './fonts/ys-display/fonts.css'
import './style.css'


import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData, makeIndex } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";

const api = initData();


const localSellers = makeIndex(sourceData.sellers, 'id', v => `${v.first_name} ${v.last_name}`);
const localCustomers = makeIndex(sourceData.customers, 'id', v => `${v.first_name} ${v.last_name}`);
const localData = sourceData.purchase_records.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: localSellers[item.seller_id],
    customer: localCustomers[item.customer_id],
    total: item.total_amount
}));


function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage) || 10;
    const page = parseInt(state.page) || 1;
    return { ...state, rowsPerPage, page };
}

async function render(action) {
    const state = collectState();
    let query = {};

    query = applySearching(query, state, action);
    query = applyFiltering(query, state, action);
    query = applySorting(query, state, action);
    query = applyPagination(query, state, action);

    const { total, items } = await api.getRecords(query);

    updatePagination(total, query);
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

const { applyPagination, updatePagination } = initPagination(
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

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);



const initialState = { page: 1, rowsPerPage: 10 };
const initialItems = localData.slice(0, 10);
updatePagination(localData.length, initialState);
sampleTable.render(initialItems);


async function init() {
    try {
        const indexes = await api.getIndexes();
        updateIndexes(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });
        await render();
    } catch (error) {
        console.warn("Сервер недоступен, остаемся на локальных данных.", error);
    }
}

init();
