import { articleConstants } from '../_constants';

export function addArticle(state = {}, action) {
    switch (action.type) {
        case articleConstants.ADD_REQUEST:
            return { adding: true };
        case articleConstants.ADD_SUCCESS:
            return {};
        case articleConstants.ADD_FAILURE:
            return {};
        default:
            return state
    }
}
