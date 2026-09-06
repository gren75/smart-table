export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach(elementName => {
        const values = Object.values(indexes[elementName]);
        values.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            elements[elementName].append(option);
        });
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.js-filter-group');
            const input = parent?.querySelector('input, select');
            if (input && field) {
                input.value = '';
                state[field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные
        return data.filter(row => {
            // Проверяем каждое поле фильтра
            const totalFrom = state.totalFrom;
            const totalTo = state.totalTo;
            const searchBySeller = state.searchBySeller;
            const dateFilter = state.date;
            const customerFilter = state.customer;

            // --- Фильтр по минимальной сумме (totalFrom) ---
            if (totalFrom && totalFrom !== '') {
                const min = parseFloat(String(totalFrom).replace(/\s/g, ''));
                const value = parseFloat(String(row.total).replace(/\s/g, ''));
                if (!isNaN(min) && !isNaN(value) && value < min) {
                    return false;
                }
            }

            // --- Фильтр по максимальной сумме (totalTo) ---
            if (totalTo && totalTo !== '') {
                const max = parseFloat(String(totalTo).replace(/\s/g, ''));
                const value = parseFloat(String(row.total).replace(/\s/g, ''));
                if (!isNaN(max) && !isNaN(value) && value > max) {
                    return false;
                }
            }

            // --- Фильтр по продавцу (searchBySeller) — точное совпадение ---
            if (searchBySeller && searchBySeller !== '') {
                if (String(row.seller) !== String(searchBySeller)) {
                    return false;
                }
            }

            // --- Фильтр по дате — поиск по вхождению ---
            if (dateFilter && dateFilter !== '') {
                if (!String(row.date).toLowerCase().includes(String(dateFilter).toLowerCase())) {
                    return false;
                }
            }

            // --- Фильтр по покупателю — поиск по вхождению ---
            if (customerFilter && customerFilter !== '') {
                if (!String(row.customer).toLowerCase().includes(String(customerFilter).toLowerCase())) {
                    return false;
                }
            }

            return true;
        });
    };
}
