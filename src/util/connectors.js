import { Connect, SimpleSigner } from 'uport-connect'

let uport = new Connect('proofile.', {
  clientId: '2ojoJBSkNKav2rhzgtXHVo9Q4NJKbNxipy6',
  network: 'rinkeby',
  signer: SimpleSigner('96106fc1af468d8f36c50aba6710da5bcee11ee23e203c215565ffb60c977fde')
})

let web3 = uport.getWeb3()


export {
  uport,
  web3
}
