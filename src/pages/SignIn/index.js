import { useState } from "react";
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Form, Button, Spinner } from "react-bootstrap";

import { AlertActions } from '../../store/reducers/alert'
import useAuthentication from '../../hooks/authentication'

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {signIn, error } = useAuthentication()
  
  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const callback = () => {
      navigate('/')
      dispatch(AlertActions.setAlertText('Va-it logat cu succes!'))
    }
    
    await signIn(email, password, callback);

    setLoading(false);
  }

  return (
    <Container className="w-50">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-3">
          <Form.Label>Adresa email</Form.Label>
          <Form.Control type="email" placeholder="Adresa email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mb-3">
          <Form.Label>Parola</Form.Label>
          <Form.Control type="password" placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading} className="mb-3">
          Log In
          {loading && <Spinner animation="border" size='sm' style={{marginLeft: 20}} />}
        </Button>

        {error && <div className="mt-3 text-danger">{error}</div>}
      </Form>

      <div className="text-center">
        <p>Nu aveți un cont? <Link to="/sign-up">Sign up</Link></p>
      </div>
    </Container>
  );
}

export default LoginPage;
