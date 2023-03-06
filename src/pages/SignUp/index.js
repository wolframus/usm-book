import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import { getStorage, getDownloadURL, uploadBytes, ref } from 'firebase/storage'
import { Container, Form, Button, Row, Col, Spinner, Image } from 'react-bootstrap';

import { UserActions } from '../../store/reducers/user'
import { AlertActions } from '../../store/reducers/alert'
import useAuthentication from '../../hooks/authentication';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState('');
  const navigate = useNavigate();
  const [customError, setCustomError] = useState('');
  const [loading, setLoading] = useState(false)
  
  const dispatch = useDispatch()
  const { signUp, error } = useAuthentication();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password || !fullName || !avatar) {
      setCustomError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true)
      const storage = getStorage();
      const imageRef = ref(storage, `images/avatars/${avatar.name}`);
      await uploadBytes(imageRef, avatar, 'data_url');
      
      // Get the download URL for the image
      const downloadUrl = await getDownloadURL(imageRef);
      

    const callback = () => {
      navigate('/')
      dispatch(AlertActions.setAlertText('Va-it inregistrat cu succes!'))
    }

      const meta = {  displayName: fullName, photoURL: downloadUrl }
      await signUp(email, password, meta, callback);
      dispatch(UserActions.setUser({email, ...meta}))
    } catch (err) {
      console.error("err: ", err)
      setCustomError(typeof err === 'string' ? err : JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  };


  return (
    <Container>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formBasicFullName">
              <Form.Label>Nume deplin</Form.Label>
              <Form.Control required type="text" placeholder="Introdu nume deplin" value={fullName} onChange={(event) => setFullName(event.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Adresa email</Form.Label>
              <Form.Control required type="email" placeholder="Introdu adresa email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Parola</Form.Label>
              <Form.Control required type="password" placeholder="Parola" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formBasicAvatar">
              <Form.Label>Fotografia</Form.Label>
              <Form.Control required type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files[0])}/>
            </Form.Group>
            {/* display loaded avatar here */}
            {avatar && (
              <div className="d-flex align-items-center mt-3">
                <Image src={URL.createObjectURL(avatar)} roundedCircle width={115} height={115} className="mr-3" />
              </div>
            )}
          </Col>
        </Row>


        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 30}}>
          <Button variant="primary" type="submit" style={{paddingRight: 50, paddingLeft: 50}}>
            Sign Up
            {loading && <Spinner animation="border" size='sm' style={{marginLeft: 20}} />}
          </Button>
        </div>

        <div className="text-center">
          <p>Aveți deja un cont? <Link to="/sign-in">Sign In</Link></p>
        </div>
        
        {error || customError ? <p className="text-danger">{error || customError}</p> : null}
      </Form>
    </Container>
  );
}

export default SignUp;
