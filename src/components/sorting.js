import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    // Переменные для хранения текущего состояния сортировки
    let field = null;  // Поле, по которому сортируем ('date' или 'total')
    let order = null;  // Направление сортировки ('asc' или 'desc')
    
    return (data, state, action) => {
        // Временно сохраняем значения, чтобы потом применить их
        let currentField = field;
        let currentOrder = order;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            // Меняем состояние сортировки по кругу: none -> asc -> desc -> none
            action.dataset.value = sortMap[action.dataset.value];
            
            // Сохраняем поле и направление сортировки
            currentField = action.dataset.field;
            currentOrder = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            // Проходим по всем кнопкам сортировки
            columns.forEach(column => {
                // Если это не та кнопка, на которую нажали
                if (column.dataset.field !== action.dataset.field) {
                    // Сбрасываем ее в состояние 'none'
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            // Проходим по всем кнопкам сортировки
            columns.forEach(column => {
                // Ищем кнопку, у которой не 'none' (активна сортировка)
                if (column.dataset.value !== 'none') {
                    // Сохраняем поле и направление сортировки
                    currentField = column.dataset.field;
                    currentOrder = column.dataset.value;
                }
            });
        }
        
        // Обновляем сохраненные значения
        field = currentField;
        order = currentOrder;
        
        // Применяем сортировку к данным
        // Если field и order есть, сортируем, иначе возвращаем как есть
        return sortCollection(data, field, order);
    }
}
