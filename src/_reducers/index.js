import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { addArticle } from './add-article.reducer';
import { articles } from './articles.reducer';

const rootReducer = combineReducers({
    authentication,
    registration,
    users,
    addArticle,
    articles,
    alert
});

export default rootReducer;
