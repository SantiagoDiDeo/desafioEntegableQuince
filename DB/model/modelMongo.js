const mongoose = require('mongoose')
const { Schema, model } = mongoose



const productSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  thumbnail: { type: String, required: true }
})

productSchema._id = new mongoose.Types.ObjectId();



const cartSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    products: { type: Array, required: true }
})


const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  age: { type: Number, required: true },
  nickname: { type: String, required: true },
  avatar: { type: String, required: true }
})

const messageSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  text: { type: String, required: true }
})


const chatSchema = new Schema({
  chatid: { type: String, required: true },
  messages: [ {userSchema, messageSchema} ]
})



const productModel = model('Product', productSchema)
const cartModel = model('Cart', cartSchema)
const chatModel = model('Chat', chatSchema)



module.exports = { productModel, cartModel, chatModel }