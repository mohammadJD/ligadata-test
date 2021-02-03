import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './article.css';

import { articleActions } from '../../_actions';
import {articles} from "../../_reducers/articles.reducer";

function ArticlesPage() {
    const articles = useSelector(state => state.articles);
    // const user = useSelector(state => state.authentication.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(articleActions.getAll());
    }, []);

    function handleDeleteItem(id) {
        dispatch(articleActions.delete(id));
    }

    return (
        <div className="article-page">
            <div className="col-12">
            <h1>Article page</h1>
            <h3>All Articles:</h3>
            {articles.loading && <em>Loading articles...</em>}
            {articles.error && <span className="text-danger">ERROR: {articles.error}</span>}
            {articles.items &&
            <ul>
                {articles.items.map((item, index) =>
                    <li key={item.id} className="item-block row">
                        <div className="col-4">
                            {/*<img src={item.image}/>*/}
                            <div className="image" style={{'backgroundImage': "url('" + item.image + "')"}}/>
                        </div>
                        <div className="col-8">
                        <p className="title">{item.title}</p>
                        <p className="date">{item.date}</p>
                        {/*<p className="content">{item.content}</p>*/}
                        <p className="content" dangerouslySetInnerHTML={{ __html: item.content }}  />
                            {
                                item.deleting ? <em> - Deleting...</em>
                                    : item.deleteError ? <span className="text-danger"> - ERROR: {item.deleteError}</span>
                                    : <span className="delete-btn"> <a onClick={() => handleDeleteItem(item.id)} className="text-primary">Delete</a></span>
                            }

                            <span className="delete-btn"> <Link to={`/articles/add/${item.id}`} className="btn btn-link">Update</Link></span>

                        </div>

                    </li>
                )}
            </ul>
            }
            <div className="form-group">
                <button className="btn btn-primary">
                    <Link to="/articles/add" className="btn btn-link c-white text-decoration-none">Add New</Link>
                </button>
                {/*<Link to="/login" className="btn btn-link">Cancel</Link>*/}
            </div>
        </div>
        </div>
    );
}

export { ArticlesPage };
