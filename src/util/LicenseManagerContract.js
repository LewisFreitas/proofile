import { web3 } from './connectors'
import LicenseManagerArtifact from './../../build/contracts/LicenseManager'

function LicenseManagerContractSetup (){

  //const contract = require('truffle-contract')
  //const base = contract(BaseArtifact)

  let abi = web3.eth.contract(LicenseManagerArtifact.abi)

  let obj = abi.at('0x85de49ddb6aa313fa8bdfc2eb37e886f5cee23f1')

  return obj
}


const LicenseManagerContract = LicenseManagerContractSetup()

export default LicenseManagerContract
