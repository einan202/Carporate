
import {OPEN, CLOSE} from '../actions/dropdown';
  
const initialState = {
    open: false,
    id: undefined
};

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN:
            if (state.open === false) { 
                return {
                    open: true,
                    id: action.id
                }
            };
        case CLOSE:
            if (
                state.open === true &&
                state.id === action.id
            )
            return {
                open: false,
                id: undefined
            };
    };
    return state
}