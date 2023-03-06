import moment from 'moment'
import { useNavigate } from 'react-router';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { getFirestore, doc, deleteDoc } from 'firebase/firestore'
import { Card, Container, Image, Alert, Placeholder, Button, Spinner, Breadcrumb } from 'react-bootstrap';

import ImageCarousel from '../../components/Carousel'
import { UserSelectors } from '../../store/reducers/user'
import { FeedsActions, FeedsSelectors } from '../../store/reducers/feeds'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [deletingLoading, setDeletingLoading] = useState(false)

  const currentUser = useSelector(UserSelectors.selectCurrentUser)

  const posts = useSelector(FeedsSelectors.selectFeedPosts)
  const isLoading = useSelector(FeedsSelectors.selectFeedPostsIsLoading)

  const fetchPosts = () => dispatch(FeedsActions.intentFetchPosts())

  const handleDeletePost = async (id) => {
    console.log("Deleting: ", id)
    
    setDeletingLoading(true)

      const db = getFirestore();
    const postRef = doc(db, 'posts', id);
  
    try {
      await deleteDoc(postRef);
      dispatch(FeedsActions.removePost(id))
    }catch (err) {
      console.error(err)
    } finally {
      setDeletingLoading(false)
    }
  }

  useEffect(() => {fetchPosts()}, []);
    
  return (
    <Container className="my-5" >
      {isLoading && Array.from({length: 8}).map((_, index) => 
        <Card key={index} className="mb-5" style={{ width: '30rem', margin: 'auto', }}>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
              <Placeholder xs={6} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder.Button variant="primary" xs={6} />
          </Card.Body>
        </Card>)}

      {!posts.length && <Alert variant="warning" className="m-5">
        <Alert.Heading>Nicio-un postare găsita!</Alert.Heading>
        <p>
        Dacă nu există postări, poți fi primul care să posteze!
        </p>

        <Breadcrumb>
          <Breadcrumb.Item active>Principala</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => navigate('/create-post')}>
            Creaza postare
          </Breadcrumb.Item>
        </Breadcrumb>
        
        <Button variant="primary" size="lg" onClick={() => navigate('/create-post')}>
          Adăugați postare
        </Button>
      </Alert>}
      
      {posts.map(({ id, title, content, imageUrls, createdAt, usr: {email, displayName, photoURL, uid} }) => (
        <Card key={id} className="mb-5" style={{ width: '30rem', margin: 'auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
           <Card.Header style={{width: '100%', display: 'flex', alignItems: 'center'}}>
            <Image src={photoURL} roundedCircle  style={{ marginRight: '1rem', height: '5rem' }} />
            <div>
              <span className="b">{displayName}</span>
              <br/>
              <span>{email}</span>
            </div>
          </Card.Header>

          <ImageCarousel images={imageUrls} />

          <Card.Body style={{width: '100%'}}>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{content}</Card.Text>
            <Card.Footer>
              <small className="text-muted">{moment(createdAt).format('LT')}</small>
            </Card.Footer>

            {uid === currentUser?.uid && <Alert className="mt-2"  variant={'info'} style={{display: 'flex', alignItems: 'center'}}>
              <div style={{flex: 1}}>
                Postarea mea
              </div>
              <Button onClick={() => handleDeletePost(id)} variant="danger">
                Delete
                {deletingLoading && <Spinner animation="border" size='sm' style={{marginLeft: 20}} />}
              </Button>
            </Alert>}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};


export default Home;
