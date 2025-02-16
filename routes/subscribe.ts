// pages/api/subscribe.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email } = req.body;
  const { BREVO_API_KEY, BREVO_LIST_ID } = process.env;

  if (!email) {
    return res.status(400).json({ message: 'Email é obrigatório' });
  }

  try {
    // Faz a requisição para a API do Brevo
    const brevoResponse = await axios.post(
      'https://api.brevo.com/v3/contacts',
      {
        email,
        listIds: [Number(BREVO_LIST_ID)],
        updateEnabled: true
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json({
      message: 'Inscrição realizada com sucesso',
      data: brevoResponse.data
    });
  } catch (error) {
    console.error('Erro na integração com Brevo:', error?.response?.data || error.message);
    return res.status(500).json({
      message: 'Erro ao inscrever o e-mail',
      error: error?.response?.data,
    });
  }
}
