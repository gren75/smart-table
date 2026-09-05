import { createComparison } from "../lib/compare.js";

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

    // @todo: #4.3 — настроить компаратор
    // Явно перечисляем правила, исключая 'exactEquality'
    const compare = createComparison(
        [
            'skipNonExistentSourceFields',
            'skipEmptyTargetValues',
            'failOnEmptySource',
            'arrayAsRange',       // для массива [from, to] — не используется, но пусть будет
            'stringIncludes'      // для date, customer — поиск по вхождению
        ],
        [
            // totalFrom — минимальная сумма
            (key, sourceValue, targetValue) => {
                if (key !== 'totalFrom') return { continue: true };
                if (!targetValue || targetValue === '') return { skip: true };
                const cleanTarget = String(targetValue).replace(/\s/g, '');
                const cleanSource = String(sourceValue).replace(/\s/g, '');
                const min = parseFloat(cleanTarget);
                const value = parseFloat(cleanSource);
                if (isNaN(min) || isNaN(value)) return { result: true };
                return { result: value >= min };
            },
            // totalTo — максимальная сумма
            (key, sourceValue, targetValue) => {
                if (key !== 'totalTo') return { continue: true };
                if (!targetValue || targetValue === '') return { skip: true };
                const cleanTarget = String(targetValue).replace(/\s/g, '');
                const cleanSource = String(sourceValue).replace(/\s/g, '');
                const max = parseFloat(cleanTarget);
                const value = parseFloat(cleanSource);
                if (isNaN(max) || isNaN(value)) return { result: true };
                return { result: value <= max };
            },
            // searchBySeller — точное совпадение
            (key, sourceValue, targetValue) => {
                if (key !== 'searchBySeller') return { continue: true };
                if (!targetValue || targetValue === '') return { skip: true };
                return { result: String(sourceValue) === String(targetValue) };
            }
        ]
    );

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

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    };
}
