/**
 * Инициализирует поиск
 * @param {string} searchField - имя поля поиска в форме
 * @returns {Function} функция, применяющая поиск к данным
 */
export function initSearching(searchField) {
    return (data, state) => {
        // Получаем значение поиска из состояния
        const searchValue = state[searchField]?.toLowerCase().trim() || '';
        
        // Если поиск пустой, возвращаем все данные
        if (!searchValue) {
            return data;
        }
        
        // Фильтруем данные
        return data.filter(row => {
            // Проверяем каждое поле в строке
            return Object.values(row).some(value => {
                // Приводим к строке и проверяем, содержит ли поисковую фразу
                return String(value).toLowerCase().includes(searchValue);
            });
        });
    };
}
