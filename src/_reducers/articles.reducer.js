import { articleConstants } from '../_constants';

export function articles(state = {}, action) {
    switch (action.type) {
        case articleConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case articleConstants.GETALL_SUCCESS:
            return {
                items: action.items
            };
        case articleConstants.GETALL_FAILURE:
            return {
                error: action.error
            };

        case articleConstants.GETBYID_REQUEST:
            return {
                loading:true,
            };
        case articleConstants.GETBYID_SUCCESS:
            return {
                item: action.item
            };
        case articleConstants.GETBYID_FAILURE:
            return {
                error: action.error
            };

        case articleConstants.UPDATE_REQUEST:
            return {
                loading: true
            };
        case articleConstants.UPDATE_SUCCESS:
            return {
                item: action.item
            };
        case articleConstants.UPDATE_FAILURE:
            return {
                error: action.error
            };

        case articleConstants.DELETE_REQUEST:
            // add 'deleting:true' property to user being deleted
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.id
                        ? { ...item, deleting: true }
                        : item
                )
            };
        case articleConstants.DELETE_SUCCESS:
            // remove deleted user from state
            return {
                items: state.items.filter(item => item.id !== action.id)
            };
        case articleConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
            return {
                ...state,
                items: state.items.map(item => {
                    if (item.id === action.id) {
                        // make copy of user without 'deleting:true' property
                        const { deleting, ...itemCopy } = item;
                        // return copy of user with 'deleteError:[error]' property
                        return { ...itemCopy, deleteError: action.error };
                    }

                    return item;
                })
            };
        default:
            return state
    }
}
