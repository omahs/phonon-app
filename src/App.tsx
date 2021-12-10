import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { Route } from "react-router-dom";
import Layout from "./layout/Layout";
import PhononsList from "./pages/PhononsList";
import SessionsList from "./pages/SessionsList";
/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  setupIonicReact({
    mode: "md",
  });

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Layout>
            <Route path="/" exact={true}>
              <SessionsList />
            </Route>
            <Route path="/:sessionId" exact={true}>
              <PhononsList />
            </Route>
          </Layout>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
