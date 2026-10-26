import { sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  let field = null;
  let order = null;

  return (query, state, action) => {
    let currentField = field;
    let currentOrder = order;

    if (action && action.name === "sort") {
      action.dataset.value = sortMap[action.dataset.value];

      currentField = action.dataset.field;
      currentOrder = action.dataset.value;

      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
        }
      });
    } else {
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          currentField = column.dataset.field;
          currentOrder = column.dataset.value;
        }
      });
    }

    field = currentField;
    order = currentOrder;

    const sort = field && order !== "none" ? `${field}:${order}` : null;

    return sort ? Object.assign({}, query, { sort }) : query;
  };
}
