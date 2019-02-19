'use strict'

const crypto = require('crypto')
const User = use('App/models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()
      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .from('fabriciocardosolima@gmail.com', 'Fabricio | Teste')
            .to(user.email)
            .subject('Recuperação de Senha')
        }
      )
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: 'Algo esta errado. O e-mail esta correto??'
        }
      })
    }
  }
}

module.exports = ForgotPasswordController
