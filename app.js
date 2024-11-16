const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Criando o servidor Express
const app = express();

// Usar o body-parser para entender o corpo das requisições
app.use(bodyParser.json());

// Permitir requisições de diferentes origens
app.use(cors());

// Conectar ao MongoDB (substitua pela sua URI do MongoDB Atlas)
const dbURI = 'mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/deliverydb?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.log('Erro ao conectar no MongoDB', err));

// Schema para produtos
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
});

const Product = mongoose.model('Product', productSchema);

// Schema para pedidos
const orderSchema = new mongoose.Schema({
    products: Array,
    totalAmount: Number,
    paymentMethod: String,
    deliveryOption: String,
    address: String,
    customerName: String,
    changeRequired: Boolean,
    status: { type: String, default: 'Pendente' }
});

const Order = mongoose.model('Order', orderSchema);

// Rota para cadastrar produtos
app.post('/api/products', (req, res) => {
    const { name, description, price, image } = req.body;
    const newProduct = new Product({ name, description, price, image });

    newProduct.save()
        .then(product => res.status(201).json(product))
        .catch(err => res.status(500).json({ message: 'Erro ao salvar produto', error: err }));
});

// Rota para listar produtos
app.get('/api/products', (req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(500).json({ message: 'Erro ao obter produtos', error: err }));
});

// Rota para criar pedidos
app.post('/api/orders', (req, res) => {
    const { products, totalAmount, paymentMethod, deliveryOption, address, customerName, changeRequired } = req.body;

    const newOrder = new Order({
        products,
        totalAmount,
        paymentMethod,
        deliveryOption,
        address,
        customerName,
        changeRequired
    });

    newOrder.save()
        .then(order => res.status(201).json(order))
        .catch(err => res.status(500).json({ message: 'Erro ao salvar pedido', error: err }));
});

// Rota para listar pedidos
app.get('/api/orders', (req, res) => {
    Order.find()
        .then(orders => res.json(orders))
        .catch(err => res.status(500).json({ message: 'Erro ao obter pedidos', error: err }));
});

// Iniciar o servidor
const port = 5000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
