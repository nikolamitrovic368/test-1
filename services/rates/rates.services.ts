import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()

export type ExchangeRate = {
  EUR: number
  USD: number
}

export async function getRates() {
  return (await fetch(
    'https://webservices.nbs.rs/CommunicationOfficeService1_0/ExchangeRateService.asmx',
    {
      headers: {
        'Content-Type': `application/soap+xml; charset=utf-8`,
      },
      method: 'POST',
      body: `<?xml version="1.0" encoding="utf-8"?>
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
              <soap12:Header>
                <AuthenticationHeader xmlns="http://communicationoffice.nbs.rs">
                  <UserName>vladimirc</UserName>
                  <Password>70gH5144</Password>
                  <LicenceID>10e6306c-232e-4f48-87ea-41e7d51e1fbd</LicenceID>
                </AuthenticationHeader>
              </soap12:Header>
              <soap12:Body>
                <GetCurrentExchangeRate xmlns="http://communicationoffice.nbs.rs">
                  <exchangeRateListTypeID>2</exchangeRateListTypeID>
                </GetCurrentExchangeRate>
              </soap12:Body>
            </soap12:Envelope>
          `,
    },
  )
    .then(res => res.text())
    .then(res =>
      parser
        .parse(res)
        [
          'soap:Envelope'
        ]['soap:Body'].GetCurrentExchangeRateResponse.GetCurrentExchangeRateResult['diffgr:diffgram'].ExchangeRateDataSet.ExchangeRate.reduce((acc: any, rate: any) => {
          acc[rate.CurrencyCodeAlfaChar] = rate.MiddleRate
          return acc
        }, {}),
    )) as ExchangeRate
}
