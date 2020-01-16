import React from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
  useHistory
} from "react-router-dom";
import Recommend from "./pages/discover/recommend";
import { useStore } from "reto";
import { RouterStore } from "./store/router.store";
import Index from "./pages";

function RouterContainer() {
  // 安装useLocation
  const location = useLocation();
  const history = useHistory();
  const routerStore = useStore(RouterStore);

  React.useEffect(() => {
    routerStore.updateLocation(location);
    routerStore.updateHistory(history);
  }, [location, history, routerStore]);

  return (
    <Switch>
      <Route exact path="/">
        <Redirect push to="/discover/recommend"></Redirect>
      </Route>
      <Route path="/discover/recommend" children={<Recommend />}></Route>
      <Route path="/fm" children={<Index />}></Route>
    </Switch>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <RouterContainer></RouterContainer>
    </BrowserRouter>
  );
}