import { web3 } from './connectors'
import BaseArtifact from './../../build/contracts/Base'

function BaseContractSetup (){
  web3.version.getNetwork(function(err, netId) {
    console.log(netId)
  });

  let abi = web3.eth.contract(BaseArtifact.abi)
  //let obj = abi.at("0x8f7496703d7e63828a50f3cae3285f77d5feb104")
  //let obj = abi.at("0x2bf10edbe8f0d82ce19013192de1ac57048be09d")
  let obj = abi.at("0xc3882ceaed9b330ee9ab43db04041fb586cb6adf")
  console.log(obj)
  return obj
}


const BaseContract = BaseContractSetup()

export default BaseContract
