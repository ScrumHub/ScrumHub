import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import {Main} from './components/Main';

/**
 * @returns Main component of Single Page Application, holding all other components
 */
export function App() {
  return (
        <Router>
          <Main></Main>
        </Router>
  );
}