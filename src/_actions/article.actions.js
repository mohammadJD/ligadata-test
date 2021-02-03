import { articleConstants } from '../_constants';
import { articleService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const articleActions = {
    // login,
    // logout,
    addItem,
    getAll,
    updateItem,
    getById,
    getByIdRequest,
    getByIdSuccess,
    getByIdFailure,
    delete: _delete
};

function addItem(item) {
    return dispatch => {
        dispatch(request(item));

        articleService.addItem(item)
            .then(
                item => {
                    dispatch(success());
                    history.push('/articles');
                    dispatch(alertActions.success('Article added successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(item) { return { type: articleConstants.ADD_REQUEST, item } }
    function success(item) { return { type: articleConstants.ADD_SUCCESS, item } }
    function failure(error) { return { type: articleConstants.ADD_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        articleService.getAll()
            .then(
                items => dispatch(success(items)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: articleConstants.GETALL_REQUEST } }
    function success(items) { return { type: articleConstants.GETALL_SUCCESS, items } }
    function failure(error) { return { type: articleConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request());

        articleService.getById(id)
            .then(
                item => dispatch(success(item)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: articleConstants.GETBYID_REQUEST, id } }
    function success(item) { return { type: articleConstants.GETBYID_SUCCESS, item } }
    function failure(error) { return { type: articleConstants.GETBYID_FAILURE, error } }
}

function getByIdRequest() { return { type: articleConstants.GETBYID_REQUEST } }
function getByIdSuccess(item) { return { type: articleConstants.GETBYID_SUCCESS, item } }
function getByIdFailure(error) { return { type: articleConstants.GETBYID_FAILURE, error } }

function updateItem(item) {
    return dispatch => {
        dispatch(request(item));

        articleService.updateItem(item)
            .then(
                item => {
                    dispatch(success());
                    history.push('/articles');
                    dispatch(alertActions.success('Article Updated successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(item) { return { type: articleConstants.UPDATE_REQUEST, item } }
    function success(item) { return { type: articleConstants.UPDATE_SUCCESS, item } }
    function failure(error) { return { type: articleConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        articleService.delete(id)
            .then(
                item => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: articleConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: articleConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: articleConstants.DELETE_FAILURE, id, error } }
}
