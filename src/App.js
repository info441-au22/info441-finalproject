import React from 'react'; //import React Component
import Filters from './components/Filters.jsx'
import Header from './components/SpotifyAuthButton.jsx';
import Navbar from './components/Navbar.jsx'

import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>

      <body>
        <Header />
        <Filters />
        {/* <Routes>
          <Route path='/home' element={<Header />} />
          <Route path='/home' element={<Filters />} />
        </Routes> */}
      </body>

      <footer>

      </footer>
    </>
  );
}

export default App;

// note to parsa: redeploy to azure with 'az webapp up --name spotify-recap-app --logs --launch-browser' kill current deployment with: 'az webapp deployment source delete --name spotify-recap-app --resource-group spotify-recap'