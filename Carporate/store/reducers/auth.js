import { AUTHENTICATE, SIGNUP, DETAILSFILLING, SET_DID_TRY_AL } from '../actions/auth';

const initialState = {
  token: undefined,
  userId: undefined,
  didTryAutoLogin: false,
  goToDettailsFelling: false,
  email: null,
  first_name: null,
  last_name: null,
  phone_number: null,
  age: null,
  gender: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        email: action.email,
        first_name: action.first_name,
        last_name: action.last_name,
        phone_number: action.phone_number,
        age: action.age,
        gender: action.gender,
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
           email: action.email,
           first_name: action.first_name,
           last_name: action.last_name,
           phone_number: action.phone_number,
           age: action.age,
           gender: action.gender,
          goToDettailsFelling: false
         };
    default:
      return state;
  }
};
