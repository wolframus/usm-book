import { useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Navbar, Container, Nav, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';

import HomePage from './pages/Home';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import CreatePost from './pages/CreatePost';
import AccountPage from './pages/AccountPage';
import AboutUsPage from './pages/AboutUsPage';

import PrivatePage from './hoc/PrivatePage';
import { AlertSelectors } from './store/reducers/alert';
import { UserActions, UserSelectors } from './store/reducers/user';

function App() {
  const auth = getAuth();

  const dispatch = useDispatch();
  const alert = useSelector(AlertSelectors.selectAlertData);
  const currentUser = useSelector(UserSelectors.selectCurrentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(UserActions.setUser(null));
      } else {
        dispatch(UserActions.setUser(user));
      }
    });
    return unsubscribe;
  }, [auth]);

  return (
    <Router>
      <Navbar bg='light' expand='lg'>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            Usm.Book <Badge bg='secondary'>Demo</Badge>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto' style={{ width: '100%' }}>
              <div style={{ flex: 1 }} />

              {currentUser ? (
                <>
                  <Nav.Link as={Link} to='/create-post'>
                    Creaza publicație
                  </Nav.Link>

                  <Nav.Link as={Link} to='/account'>
                    Account
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to='/sign-in'>
                    Intră
                  </Nav.Link>
                  <Nav.Link as={Link} to='/sign-up'>
                    Înregistrare
                  </Nav.Link>
                </>
              )}
              <Nav.Link as={Link} to='/about-us'>
                Despre noi
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <Alert
          show={alert.show}
          variant={alert.type}
          style={{ position: 'fixed', top: 10, right: 10 }}>
          {alert.data}
        </Alert>
      </Navbar>

      <div
        style={{
          width: '45vw',
          margin: 'auto',
          marginTop: 80,
          marginBottom: 80,
        }}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route
            exact
            path='/create-post'
            element={<PrivatePage Component={CreatePost} />}
          />
          <Route
            exact
            path='/account'
            element={<PrivatePage Component={AccountPage} />}
          />
          <Route path='/sign-in' element={<SignInPage />} />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
