'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store')
Route.post('sessions', 'SessionController.store')
Route.post('password', 'ForgotPasswordController.store')
Route.put('password', 'ForgotPasswordController.update')
Route.post('files', 'FileController.store')
Route.get('/files/:id', 'FileController.show')
