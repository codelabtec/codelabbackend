// backend/index.js
require('dotenv').config(); // Para ler variáveis de ambiente do .env
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors()); // Permite requisições de outras origens (como o front local)
app.use(express.json()); // Para conseguir ler o body em JSON

// Rota de inscrição
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  // ID da sua lista no Brevo
  const listId = process.env.BREVO_LIST_ID; 

  try {
    // Chamada para a API do Brevo
    const brevoResponse = await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        listIds: [Number(listId)]
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    // Sucesso na criação do contato
    console.log('Contato criado com sucesso:', brevoResponse.data);
    return res.status(200).json({
      message: 'Inscrição realizada com sucesso'
    });

  } catch (error) {
    console.error('Erro na integração com Brevo:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Erro ao inscrever o e-mail',
      error: error?.response?.data
    });
  }
});

// Porta do servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
