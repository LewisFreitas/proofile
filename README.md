# proofile. 
#### Ethereum, IPFS and uPort dApp for the ConsenSys Developer Program 2018

Demo version: https://proofile.herokuapp.com (deployed on Rinkeby)

### What does this project do?

Simplistically, you upload files and build your proofile. This means you can prove ownership and existence of a certain digital piece - audio, video, photos or a document. If you want others to 'legally' use it, I created a simple agreement that I call usage licenses. You provide the possiblity of others to buy licenses from you. The content can't be censored.

You can sell usage licenses. You can sell them for Ether or any ERC-20 token. The ETH will remain on the contract until you withdraw it. The ERC-20 tokens are transfered directly by the buyer.

It works on both mobile and desktop.

There is a folder called ```/info``` where you can find a folder of other contracts I did not include on this project (useful for a Marketplace), two images showing the contracts structure and the requested ```deployed_addresses.txt``` (addresses on Rinkeby testnet), ```design_pattern_decisions.md``` and ```avoiding_common_mistakes.md```.

#### Check an overview on YouTube
[![IMAGE ALT TEXT HERE](https://i.imgur.com/ukPVD15.png)](https://www.youtube.com/watch?v=q8cwxtJZ35k)

#### Try out these IPFS hashes on the landing page search bar
1. ```QmcCJG9ZPuAH28pJ22fw3SnkgNmUwYXE5fxxiTWK3d8Wfk```
2. ```QmTpp6wjBNpJFagvaqgEsa9pUViWZaUsTf92LmJz5moF3u```
3. ```QmYqVbQFrNF6HkX2bPWDqSi74m2xNCEXGXuUcM86WZZCDQ```
4. ```QmctXQPGQUHX2wHu9cf6h71wJRvL6geDE1qcq1qtknUxdY```
5. ```QmctdAt5zeHcf3NyntetvtMJWMtESDqoLTtn9YEg4ECwjA```
6. ```Qmcgr4NuoEnDDFc2aMXDA8gkU2f516yff1FD9NdmCQgyxK```
![fsdf](https://i.imgur.com/TFu1YYG.png)


### Rationale
I would like you to picture a world where you own every piece of digital media you produce (audio, image and video). In this world, you are allowed to create a verifiable proof that you are the legitimate owner of these digital pieces. You can prove your identity, the ownership and existence of a particular digital piece.

When I first read the project ideas ConsenSys offered I kind of liked every single one of them. At first I wanted to do the Marketplace, but then I liked more the Proof of Existence. While confused, I decided to create my own idea and use requirements from both.

As an amateur musician who worked on music production professionally for more than one year, I found out that digital rights are a mess. My idea is to develop a way to help music producers create digital rights easily and allow anyone to use their content with easy to verify agreements. Smart contracts, uPort and IPFS together made me realize this could be possible.
As I dug deeper, I realized this could be applied to any kind of digital content.

In 2017, CryptoKitties introduced the concept of ERC721, NFT (Non-fungible tokens) or deeds. In my perception, there can't be two kinds of the same beat, like there can't be two same kitties or two different house ownership certificates. So I chose to use ERC721 as the baseline for every digital content uploaded to the platform.  

Proofile is a platform that allows you to upload a file: audio, video, picture or document. This file is stored in IPFS and a couple of variables stored in the <Base> contract.This contract stores the IPFS hash, the name, description, two tags, the creator and the timestamp. These are all strings and define the structure Deed. A Deed or ERC721 is a concept that was made popular by CryptoKitties and represent non-fungible tokens.
This makes sense for a unique digital piece. The standard offers you the possibility to sell or trade it with anyone, and even allow 3rd parties to consume your deed's metadata.

My solution was to create a simple License issuer where I define a simple agreement of Ether or ERC20 tokens in exchange of a license. This is a one tier license (others could arise), one simple agreement. You buy, you can use forever.

### User stories
The user stories will resemble a lot proof-of-existence or marketplace ones with a couple of twists.

1. You upload a drum beat you are proud of. This will create a timestamped verifiable proof of ownership. You can then start a license sale for an amount of Ether or any ERC20 token.
2. You can buy a usage license for a guitar riff that a user uploaded. He asks for 100 PRF (proofile ERC-20 tokens) and 0.01 ETH. You buy it for Ether. You can prove that you bought a license (forever!)
3. You just took an amazing picture. 3 bloggers are interestead in using it, you start a license sale so they can buy it.
4. There's been a car blocking your garage entrance for 2 weeks. You can take a picture and prove that this car has been there, at least since you uploaded the picture on your proofile, since you can't mess with the timestamp.
5. You just had an amazing idea. You want to be credited for it. You uploaded a video explaining it. You were the first one doing it. It's yours. Forever.
6. You have information that has been censored by other platforms/government/wtvr. Upload your video, document, picture or audio - it won't be censored here.

### How to set it up?

1. ```git clone```
2. ```npm install```
3. To run: ```npm run start```, should start a working version locally on localhost:3000

This project uses uPort to sign transactions (not Metamask) and as a login mechanism. 

This project runs on Rinkeby, because of uPort. If you want to get your hands (super) dirty watch this and try to do something with "Deploy uPort IdentityManager Smart Contracts to Ganache" locally.
https://www.youtube.com/watch?v=6tf58L0Twt0

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/6tf58L0Twt0/0.jpg)](https://www.youtube.com/watch?v=6tf58L0Twt0)



