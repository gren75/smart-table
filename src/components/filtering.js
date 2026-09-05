import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    // Проходим по всем ключам в indexes (например: 'searchBySeller')
    Object.keys(indexes).forEach(elementName => {
        // Получаем массив значений для этого элемента
        const values = Object.values(indexes[elementName]);
        
        // Для каждого значения создаем option и добавляем в select
        values.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            elements[elementName].append(option);
        });
    });

    // @todo: #4.3 — настроить компаратор
    // Создаем функцию сравнения на основе стандартных правил
    const compare = createComparison(defaultRules);

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        // Проверяем, была ли нажата кнопка очистки (с именем 'clear')
        if (action && action.name === 'clear') {
            // Получаем имя поля из data-field
            const field = action.dataset.field;
            // Находим родительский контейнер с классом js-filter-group
            const parent = action.closest('.js-filter-group');
            // Находим input или select внутри родителя
            const input = parent?.querySelector('input, select');
            
            if (input && field) {
                // Очищаем значение поля
                input.value = '';
                // Обновляем состояние
                state[field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        // Фильтруем данные: оставляем только те строки, где compare вернул true
        return data.filter(row => compare(row, state));
    }
}
