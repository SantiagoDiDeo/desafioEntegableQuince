const connectToDb = require('../DB/config/connectToDb')
const { chatModel } = require('../DB/model/modelMongo')
const normalizedData = require('../normalizr/normalizr')

class Container {

  constructor( schema ) {
      this.schema = schema
  }
  

  async getArray() {
    try{
      await connectToDb()
      const messagesInDb = await this.schema.findOne ( { chatid: 'chat1'},
        { projection: { messages: 1, _id: 0 }} )
      return normalizedData( messagesInDb )
      console.log(messagesInDb)
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }
 

  async add( message ) {
    try{
      await connectToDb()
      const messagesInDb = await this.schema.findOne ( { chatid: 'chat1' } ,
      { projection: { messages: 1, _id: 0 }} )
      await this.schema.updateOne( { chatid: 'chat1' } ,
      { $set: { messages: messagesInDb.push( message) }} )
      return
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

}


const chats = new Container ( chatModel )


module.exports = {chats}