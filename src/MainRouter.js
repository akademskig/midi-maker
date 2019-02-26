
import React from "react"
import { Route, Switch } from "react-router"
import Home from "./views/Home"
import Menu from "./components/Menu";
import NewMidi from "./views/NewMidi";

export const MainRouter = (props) => (
    <div>
        <Menu></Menu>
        <Switch>
            <Route exact path="/" component={Home} ></Route>
            <Route path="/newMidi" component={NewMidi} ></Route>
        </Switch>
    </div>
)