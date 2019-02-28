'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  /**
   * Create/save a new file.
   * POST files
   */
  async store ({ request, response }) {
    try {
      if (!request.file('file')) return
      const upload = request.file('file', { size: '2mb' })
      const filename = `${Date.now()}.${upload.subtype}`
      await upload.move(Helpers.tmpPath('uploads'), {
        name: filename
      })
      if (!upload.moved()) throw upload.error()

      const file = await File.create({
        file: filename,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })
      return file
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro no upload do arquivo' } })
    }
  }

  /**
   * Método para exibir os uploads
   */
  async show ({ params, response }) {
    const file = await File.findOrFail(params.id)
    return response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }
}

module.exports = FileController
