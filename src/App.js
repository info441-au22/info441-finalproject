import React from "react"; //import React Component
import Filters from "./components/Filters.jsx";
import Header from "./components/SpotifyAuthButton.jsx";
import { PageFooter } from "./components/Sections.jsx";
import GettingStarted from "./components/GettingStarted.jsx";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <header>
        <GettingStarted />
      </header>

      <body>
        <Header />
        <Filters />
      </body>

      <footer>
        <PageFooter />
      </footer>
    </>
  );
}

export default App;

// note to parsa: redeploy to azure with 'az webapp up --name spotify-recap-app --logs --launch-browser' kill current deployment with: 'az webapp deployment source delete --name spotify-recap-app --resource-group spotify-recap'
