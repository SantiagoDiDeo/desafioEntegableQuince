const connectToDb = require('../DB/config/connectToDb')
const { productModel } = require('../DB/model/modelMongo')



class Container {

  constructor( schema ) {
      this.schema = schema
  }
  
  ID_FIELD = '_id';

  async getArray() {
    try{
      await connectToDb()
      const documentsInDb = await this.schema.find()
      return documentsInDb
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }
 


  async getById( ObjectId) {
    try {
      await connectToDb()
      const documentInDb = await this.schema.find({[this.ID_FIELD] : ObjectId})
      return documentInDb ? documentInDb : null

    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }




  async deleteAll() {
    try {
      await connectToDb()
      await this.schema.deleteMany()
      return 
    } catch(err) {
      console.log(`Error: ${err}`)
      return false
    }
  }


  async add( item ) {
    try{
      await connectToDb()
      const newProduct = new productModel( item )
      await newProduct.save()
        .then(product => console.log(`Se ha agregado a la base de datos elemento con id: ${{[this.ID_FIELD] : ObjectId}}`))
        .catch(err => console.log(err))
      return
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }

}

const products = new Container( productModel )


module.exports = { products } 