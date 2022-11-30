import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpotifyAuthButton from './components/SpotifyAuthButton';
import Filters from './components/Filters';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SpotifyAuthButton/>
        <Filters/>
      </header>
    </div>
  );
}

export default App;
