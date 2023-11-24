import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Home = () => {
  const [articles, setArticles] = useState([])
  const reload = () => {
    // Kiểm tra giá trị trong localStorage
    const isReloaded = localStorage.getItem('isReloaded')

    if (!isReloaded) {
      // Đặt giá trị vào localStorage
      localStorage.setItem('isReloaded', 'true')

      // Tải lại trang
      window.location.reload()
    }

    // Khi component unmount, xóa giá trị khỏi localStorage (nếu bạn muốn)
    return () => {
      localStorage.removeItem('isReloaded')
    }
  }
  const fetchCryptoNews = async () => {
    const options = {
      method: 'GET',
      url: 'https://newsapi.org/v2/everything?q=bitcoin&apiKey=14b7bf44c7d142ea9ae448a7cb08cbfe',
    }

    try {
      const response = await axios.request(options)

      console.log(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    reload()
    fetchCryptoNews().then((result) => {
      setArticles(result.articles)
    })
  }, [])

  return (
    <div className="container">
      <h1 className="m-3">Crypto News</h1>
      <ul>
        {articles.map((article) => (
          <div class="row ">
            <div class="col s12 m7">
              <div class="card">
                <div class="card-image">
                  <img src={article.urlToImage} />
                  <span class="card-title">{article.title} </span>
                </div>
                <div className="card-panel teal">
                  <div class="card-content ">
                    <p>{article.description}</p>
                  </div>
                  <div class="card-action">
                    <a href={article.url} target="blank">
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Home
