import createDataContext from './createDataContext';

const menuReducer = (state, action) => {
  switch (action.type) {
    case 'change_active_menu':
      return { ...state, activeMenu: action.payload };
    case 'change_active_submenu':
      return { ...state, activeSubMenu: action.payload };
    default:
      return state;
  }
};

const changeActiveMenu = (dispatch) => (menu) => {
  dispatch({ type: 'change_active_menu', payload: menu });
};

const changeActiveSubMenu = (dispatch) => (menu) => {
  dispatch({ type: 'change_active_submenu', payload: menu });
};

export const { Context, Provider } = createDataContext(
  menuReducer,
  { changeActiveMenu, changeActiveSubMenu },
  { activeMenu: 'indicators', activeSubMenu: 'tab01' },
);
