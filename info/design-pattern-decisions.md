## Fail early and fail loud

Functions check requires early in the function body or as modifiers, executed before the main body.

## OpenZeppelin's Pull Payment

Implementing this helps protect against re-entrancy and denial of service attacks.

## OpenZeppelin's Pausable (Circuit breakers)

Implementing this allows contract functionality to be stopped.

## OpenZeppelin's Ownable (Restricting Access)

The Ownable contract has an owner address, and provides basic authorization control functions, this simplifies the implementation of "user permissions" and permits specific addresses to run functions.

## ERC721

The ERC721 standard stands for the uniqueness of tokens. This standard allowed me to implement a couple of battle-tested methods to interact with unique and ownership verifyable digital pieces.

This standard establishes the ownership of tokens to an address. This may also be an example of Restricting Access.

## Modularity

By using the ERC721 standard, I believe it is easy to implement more contracts to interact with these sort of digital pieces in the future.
The license manager can be swapped by a new and different license manager without affecting the created tokens. I believe this standard helps with modularity, which allows the further development of this dapp after a final deployment on the main-net.
