const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {pool} = require('./config')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const getMessages = (request, response) => {
  pool.query('SELECT * FROM messages', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addMessage = (request, response) => {
  const {email, subject, message} = request.body

  pool.query(
    'INSERT INTO messages (email, subject, message) VALUES ($1, $2, $3)',
    [email, subject, message],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Message sent.'})
    },
  )
}

app
  .route('/messages')
  // GET endpoint
  .get(getMessages)
  // POST endpoint
  .post(addMessage)


  
const getContent = (request, response) => {

  pool.query('SELECT * FROM content', 
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addContent = (request, response) => {
  const {name, text} = request.body

  pool.query(
    'INSERT INTO content (name, text) VALUES ($1, $2)',
    [name, text],
    (error) => {
      if (error) {
        throw error
      }
      response.status(201).json({status: 'success', message: 'Content added.'})
    },
  )
}

const updateContent = (request, response) => {
    const {name, text} = request.body
  
    pool.query(
      'UPDATE content SET text = $2 WHERE name = $1',
      [name, text],
      (error) => {
        if (error) {
          throw error
        }
        response.status(201).json({status: 'success', message: 'Content updated.'})
      },
    )
  }


  app
  .route('/content')
  // GET endpoint
  .get(getContent)
  // POST endpoint
  .post(addContent)
  // UPDATE endpoint
  .put(updateContent)

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`)
})