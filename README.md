# usdr-subgraph

# Avalanche Subgraph

TheGraph exposes a GraphQL endpoint to query the events and entities within the Avlanche ecosystem.

Currently, there is one subgraph, but additional subgraphs can be added in this repository.

## Subgraphs

1. **[Avalanche Mainnet](https://thegraph.com/hosted-service/subgraph/metlco4/usdr)**: Tracks transactions on the Avalanche network.
2. **[Fuji Testnet](https://thegraph.com/legacy-explorer/subgraph/pancakeswap/blocks)**: Tracks events on the Avalanche C Chain.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
yarn global add @graphprotocol/graph-cli
```
