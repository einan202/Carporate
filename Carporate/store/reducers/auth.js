import { AUTHENTICATE, SIGNUP, DETAILSFILLING, SET_DID_TRY_AL } from '../actions/auth';

const initialState = {
  token: undefined,
  userId: undefined,
  didTryAutoLogin: false,
  goToDettailsFelling: false,
  email: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        email: action.email
      };
      case SET_DID_TRY_AL:
        return {
          ...state,
          didTryAutoLogin: true
        };
     case SIGNUP:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        email: action.email,
        goToDettailsFelling: true
       };
       case DETAILSFILLING:
         return {
           ...state,
          goToDettailsFelling: false
         };
    default:
      return state;
  }
};
