import { Carousel } from 'react-bootstrap'

function ImageCarousel({images}) {
  console.log("imageUrls", images)
  
  if(!images?.length) return
  
  return <Carousel controls={images.length > 1} variant="dark" nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" />} prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" />}>
   {images.map(image => <Carousel.Item>
    <img src={image} className="d-block w-100"/>
  </Carousel.Item>
  )}
</Carousel> 
}

export default ImageCarousel