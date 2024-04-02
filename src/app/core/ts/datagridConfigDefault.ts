export interface DatagridConfig {
  id: string;
  key: string;
  addRow: boolean;
  allowColumnReordering: boolean;
  allowedPageSizes: number[];
  allowColumnResizing: boolean;
  clearFilterButton: boolean;
  columnAutoWidth: boolean;
  columnChooserButton: boolean;
  columnFixing: boolean;
  columnHidingEnabled: boolean;
  columnMinWidth: number;
  columnResizingMode: 'widget' | 'nextColumn' | 'widgetAndNextColumn';
  deleteRows: boolean;
  deleteSelectedsButton: boolean;
  editRow: boolean;
  editingMode: string | null;
  exportButtonDefault: boolean;
  exportButton: boolean;
  filterRow: boolean;
  groupPanel: boolean;
  grouping: boolean;
  headerFilter: boolean;
  inputToolbar: boolean;
  paginationRow: boolean;
  pagesSizesSelection: boolean;
  refreshButton: boolean;
  rowAlternationEnabled: boolean;
  renderAsync: boolean;
  searchPanel: boolean;
  selection: boolean;
  selectMode: 'multiple' | 'single' | 'none';
  selectedRowKeys: any[];
  showBorders: boolean;
  showColumnHeaders: boolean;
  showColumnLines: boolean;
  showRowLines: boolean;
  sortingMode: 'none' | 'single' | 'multiple';
  toolbar: boolean;
  paging: { pageSize: number };
  maxHeightDesktop: number;
  maxHeightMobile: number;
  refresh: () => void;
  acoes: Button[];
  customButtons: CustomButton[];
}

interface Button {
  icon: string;
  icon_tipo?: string;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  tooltip?: string;
  text?: string;
  permissao?: string;
  is_excluir?: boolean;
  show?: (data: any) => boolean;
  click: (data: any) => void;
}

interface CustomButton {
  icon: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger';
  tooltip?: string;
  text?: string;
  permissao?: string;
  icon_tipo?: string;
  is_excluir?: boolean;
  click: () => void;
}


export const datagridConfigDefault = () => {
  let configuracao: DatagridConfig = {
    id: "datagrid",
    key: "id",
    addRow: false,
    allowColumnReordering: true,
    allowedPageSizes: [50],
    allowColumnResizing: true,
    clearFilterButton: true,
    columnAutoWidth: false,
    columnChooserButton: true,
    columnFixing: true,
    columnHidingEnabled: false,
    columnMinWidth: 125,
    columnResizingMode: "widget",
    deleteRows: false,
    deleteSelectedsButton: false,
    editRow: false,
    editingMode: null,
    exportButtonDefault: false,
    exportButton: true,
    filterRow: true,
    groupPanel: true,
    grouping: true,
    headerFilter: true,
    inputToolbar: false,
    paginationRow: true,
    pagesSizesSelection: false,
    refreshButton: true,
    rowAlternationEnabled: true,
    renderAsync: false,
    searchPanel: true,
    selection: false,
    selectMode: 'multiple',
    selectedRowKeys: [],
    showBorders: false,
    showColumnHeaders: true,
    showColumnLines: true,
    showRowLines: true,
    sortingMode: 'multiple',
    toolbar: true,
    paging: {pageSize: 1},
    maxHeightDesktop: 27.5,
    maxHeightMobile: 12.5,
    refresh: () => {},
    acoes: [],
    customButtons: [],
  }
  return configuracao;
}
