import React, { useEffect, useRef } from 'react'
import M from 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css'
import styles from './Carousel.module.css'
const Carousel = ({ images }) => {
  let carousel = useRef(null)

  useEffect(() => {
    if (images) {
      const options = {
        duration: 200,
        // fullWidth: true,
        dist: -100,
        numVisible: 3,
      }
      var elems = document.querySelectorAll('.carousel')
      var instances = M.Carousel.init(elems, options)
    }
  }, [images])

  return (
    <>
      {images && (
        <div
          ref={carousel}
          className={`carousel col s7 ${styles.custom_carousel}`}
        >
          {images.map((image) => (
            <a className="carousel-item  " key={image}>
              <img alt={`${image}`} src={`https://cf-ipfs.com/ipfs/${image}`} />
            </a>
          ))}
        </div>
      )}
    </>
  )
}

export default Carousel
