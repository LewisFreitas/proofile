# Avoiding common mistakes
Some examples are:

## Denial of service attacks

This attack may happen when a user buys a license, sending Ether to the owner. I chose to use asyncSend() presented on OpenZeppelin's PullPayment design pattern. The receiver can withdraw their Ether later on from the contract.


## Transaction-Ordering Attacks

I created a Transaction Counter (txCounter) for each license. Everytime a owner starts selling or updates the price of a license, the txCounter is incremented. This way, when a user buys a license and right after transaction is broadcasted to the network, we can verify that the owner won't change the price in a malicious way.
This could be irrelevant given that I check the msg.value and it has to be the same as the price. Either way, it's cool to have this in mind.

## Integer Overflow and Underflow

"Integers can underflow or overflow in the EVM". To prevent this to happen I chose to implement a library by OpenZeppelin called SafeMath. SafeMath checks for underflow and overflow when doing arithmetic functions.
