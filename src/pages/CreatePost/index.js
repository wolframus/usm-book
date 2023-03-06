import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { collection, addDoc, getFirestore, } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes  } from 'firebase/storage';
import { Form, Button, Container, Row, Col, Card, Spinner, Modal, ProgressBar, Overlay } from 'react-bootstrap';

import { FeedsActions } from '../../store/reducers/feeds'
import { UserSelectors } from '../../store/reducers/user';

const PostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageUrls, setImagesUrl] = useState([])
  
  const progressBar = useRef()

  const [showOverlay, setShowOverlay] = useState(false)

  const [imageToUpload, setImages] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const currentUser = useSelector(UserSelectors.selectCurrentUser)

  const navigate = useNavigate()

  const progressColor = useMemo(() => {
    if(!title || !content) return 'danger'
    if(!imageUrls.length) return 'warning'

    return 'success'
  }, [title, content, imageUrls.length])

  const toolTipMeta = useMemo(() => {
    switch (progressColor) {
      case 'danger': return {label: "Titlu si Continutul sunt obligatorii", color: 'red'}
      case 'success': return {label: 'Totul este completat', color: 'green'}
      case 'warning': return {label: 'Ar fi bine sa completati imaginile', color: 'orange'}
    }
  }, [progressColor])

  const progress = useMemo(() => {
    const items = [title, content, imageUrls.length].filter(item => !!item)
    return Math.ceil(items.length * 33.333)
  }, [title, content, imageUrls.length])

  const onImageChange = (images) => {
    if (!images?.length) {
      document.getElementById('file-input').value = null;
      setImages()
      setImagesUrl()
      return
    }

    console.log("images: ", images, images.length)
    
    const imgUrls = []
    for (let i = 0; i < images.length; i++){
      const currentImage = images[i]
      const imgUrl = URL.createObjectURL(currentImage)
      imgUrls.push(imgUrl)
    }

      setImages(images)
      setImagesUrl(imgUrls);
  }

  const removeImage = index => {
    setImages(prev => {
      const updList = []
      for(let i = 0; i < prev.length; i++){
        if(index === i) continue

        const currentImage = prev[i]
        updList.push(currentImage)
      }
      return updList
    })
    setImagesUrl(prev => {
      const updList = []
      for(let i = 0; i < prev.length; i++){
        if(index === i) continue

        const currentImage = prev[i]
        updList.push(currentImage)
      }
      return updList
    })

    const attachments = document.getElementById("file-input").files; // <-- reference your file input here
    const fileBuffer = new DataTransfer();

    // append the file list to an array iteratively
    for (let i = 0; i < attachments.length; i++) {
        // Exclude file in specified index
        if (index !== i)
            fileBuffer.items.add(attachments[i]);
    }
    
    // Assign buffer to file input
    document.getElementById("file-input").files = fileBuffer.files;
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true)

    try {
    // Upload image to Firebase Storage
      const storage = getStorage();
      
      const downloadUrls = []
      for (let i = 0; i < imageToUpload.length; i++) { 
        const currentImage = imageToUpload[i]
        const imageRef = ref(storage, `images/${currentUser.uid}/${currentImage.name}`);
        await uploadBytes(imageRef, currentImage, 'data_url');
        const downloadUrl = await getDownloadURL(imageRef);
        downloadUrls.push(downloadUrl)
      }


    const db = getFirestore();
    const postsRef = collection(db, 'posts');
    const newDoc = {
      title,
      content,
      usr: currentUser,
      imageUrls: downloadUrls,
      authorId: currentUser.uid,
      createdAt: new Date().getTime()
    }
    await addDoc(postsRef, newDoc);

    dispatch(FeedsActions.pushCreated(newDoc))
      
    // Clear form fields
      setTitle('');
      setContent('');
      setImages(null);
      setImagesUrl('');

      navigate('/')
    } catch (err) {
      console.error("err: ", err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <>
    <Container>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
            <Form onSubmit={(e) => {
              e.preventDefault()
              setShowConfirmation(true)
            }}>
            <Form.Group controlId="formPostTitle" className="mb-3">  
              <Form.Label>Titlu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduceți titlul postării"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPostContent" className="mb-3">
              <Form.Label>Continut</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Introduceți continutul postării"
                rows={5}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPostImage" className="mb-4">
              <Form.Label>Imagini</Form.Label>
              <Form.Control
                multiple
                type="file"
                id="file-input"
                accept="image/*"
                className="mb-4"
                onChange={(event) => onImageChange(event.target.files)}
              />
              {imageUrls.map((image, index) => <Card className="mb-3" style={{ width: '10rem', margin: 'auto', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card.Img variant="top" src={image} />
                <Button
                  variant="danger"
                  onClick={() => removeImage(index)}
                  style={{position: 'absolute',zIndex: 1,}}
                >
                  Ștergeți
                </Button>
              </Card>)}
            </Form.Group>

            <ProgressBar ref={progressBar} onClick={() => setShowOverlay(prev => !prev)} now={progress} label={`${progress}%`} variant={progressColor} />

            <Overlay target={progressBar} show={showOverlay} placement="right">
              {({
                placement: _placement,
                arrowProps: _arrowProps,
                show: _show,
                popper: _popper,
                hasDoneInitialMeasure: _hasDoneInitialMeasure,
                ...props
              }) => (
                <div
                  {...props}
                  style={{
                    position: 'absolute',
                    backgroundColor: toolTipMeta.color,
                    padding: '2px 10px',
                    color: 'white',
                    borderRadius: 3,
                    ...props.style,
                  }}
                >
                  {toolTipMeta.label}
                </div>
              )}
            </Overlay>
              
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
              <Button disabled={loading } variant="primary" type="submit" style={{paddingRight: 70, paddingLeft: 70}}>
                Posteaza
                {loading && <Spinner animation="border" size='sm' style={{marginLeft: 20}} />}
              </Button>
            </div>

          </Form>
        </Col>
      </Row>
    </Container>

      
    <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sunteti sigur?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Sunteți pe cale să trimiteți această postare.</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmation(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Ok
          {loading && <Spinner animation="border" size='sm' style={{marginLeft: 20}} />}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default PostForm;
