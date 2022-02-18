enum HttpMessages {
  H200 = 'Everything went fine. I return the resource you requested',
  H201 = 'Voilá. We successfully created a new resource for you',
  H204 = 'There is nothing to see here. Useful if you just deleted an object successfully',
  H400 = 'You did not provide valid information',
  H401 = 'You did not provide valid credentials',
  H404 = 'Requested object could not be found',
  H422 = 'Resource cannot be saved. Maybe a validation error?',
  H429 = 'You sent too many requests, try again later',
  H500 = 'We are sorry an internal error has occurred, try again later'
}

export default HttpMessages
