export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';

export const drop_down_bar = (bar_id) => {
    return dispatch => {
      dispatch({
        type: OPEN,
        bar_id
      });
    };
};

export const pick_up_bar = (bar_id) => {
    return dispatch => {
      dispatch({
        type: CLOSE,
        bar_id
      });
    };
};
