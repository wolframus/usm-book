import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { signOut, getAuth } from 'firebase/auth';
import { Alert, Container, Row, Col, Card, Button, OverlayTrigger, Popover } from 'react-bootstrap';

import { AlertActions } from '../../store/reducers/alert';
import { UserSelectors } from '../../store/reducers/user'

function AccountPage() {
  const auth = getAuth();
  const dispatch = useDispatch();

  const currentUser = useSelector(UserSelectors.selectCurrentUser)

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(AlertActions.setAlertText('Va-it delogat cu succes!', 'danger'));
  };

  return (
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="p-3">
            <Card.Title className="text-center mb-3">Informația accountului</Card.Title>
            <Card.Body>
              <Row className="mb-3">
                <Col xs={12} md={4} className="font-weight-bold">
                  Email:
                </Col>
                <Col xs={12} md={8}>
                  {currentUser.email}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={4} className="font-weight-bold">
                  Nume deplin:
                </Col>
                <Col xs={12} md={8}>
                  {currentUser.displayName || 'N/A'}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={4} className="font-weight-bold">
                  UID:
                </Col>
                
                <OverlayTrigger trigger="click" placement="right" overlay={
                  <Popover id="popover-basic">
                    <Popover.Header as="h3">Păstrați în secret.</Popover.Header>
                    <Popover.Body>ID-ul vostru este <strong>{currentUser.uid}</strong></Popover.Body>
                  </Popover>}>
                  
                  <Col xs={12} md={8}>
                    {currentUser.uid.slice(0, 10)}******
                  </Col>
                </OverlayTrigger>
              </Row>
              {currentUser.photoURL && <Row className="mb-3">
                <Col xs={12} md={4} className="font-weight-bold">
                  Fotografia:
                </Col>
                <Col xs={12} md={8}>
                  <img src={currentUser.photoURL} alt="Profile" className="img-thumbnail" />
                </Col>
              </Row>}

              <Alert variant={'info'}>
                Să știți că păstrăm informația dumneavoastră în format privat față de orice parte terță și utilizator al aplicației noastre.
              </Alert>


              <Alert variant={'light'}>
                <Alert.Link href="https://firebase.google.com/">Aici</Alert.Link> puteți citi informația despre platforma cu care cooperăm pentru a crea platforma dată securizată și rapidă.
              </Alert>

              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                <Button
                  variant='danger'
                  onClick={handleSignOut}
                  style={{ alignSelf: 'end' }}>
                  Ieșiți
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AccountPage