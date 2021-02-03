import { Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import {PrivateRoute} from "./_components/PrivateRoute";
import {LoginPage} from "./pages/LoginPage";
import {RegisterPage} from "./pages/RegisterPage";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {alertActions} from "./_actions/alert.actions";
import {HomePage} from "./pages/HomePage";
import { history } from './_helpers';
import {Header} from "./_components/header";
import {ArticlesPage} from "./pages/ArticlesPage";
import {AddArticlePage} from "./pages/ArticlesPage/add";

function App() {
    const alert = useSelector(state => state.alert);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authentication.user);

    useEffect(() => {
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }, []);

  return (
    <div className="App">
        <Router history={history}>
         {user?
             (
                 <Header/>
             ):('')
         }
        <div className="jumbotron">
            <div className="container">
                <div className="col-md-8 offset-md-2">
                    {alert.message &&
                    <div className={`alert ${alert.type}`}>{alert.message}</div>
                    }

                        <Switch>
                            <PrivateRoute exact path="/" component={HomePage} />
                            <Route path="/login" component={LoginPage} />
                            <Route path="/register" component={RegisterPage} />
                            <PrivateRoute path="/articles" exact component={ArticlesPage} />
                            <PrivateRoute path="/articles/add" exact component={AddArticlePage} />
                            <PrivateRoute path="/articles/add/:id" exact component={AddArticlePage} />
                            <Redirect from="*" to="/" />
                        </Switch>

                </div>
            </div>
        </div>
    </Router>
    </div>
  );
}

export default App;
