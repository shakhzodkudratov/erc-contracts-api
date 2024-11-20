import { JsonRpcProvider } from 'ethers'
import { getContract, fetchProperties } from '../assets/erc20.contract.js'
import { errorHandler } from '../utils.js'

// https://docs.bnbchain.org/bnb-smart-chain/developers/json_rpc/json-rpc-endpoint/
const BNB_CHAIN_RPC_URL = 'https://bnb.rpc.subquery.network/public'

// https://bscscan.com/token/0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed
const MIKE_TOKEN_ADDRESS = '0xf542ac438cf8cd4477a1fc7ab88adda5426d55ed'

/**
 * @type {import('fastify').FastifyPluginAsync<{}>}
 */
export default function (f) {
    f.get('/erc20/', {
        schema: {
            querystring: {
                allOf: [
                    {
                        type: 'object',
                        properties: {
                            rpcUrl: {
                                type: 'string',
                                description: 'RPC URL of chain where contract is deployed. As default there is BNB chain',
                                default: BNB_CHAIN_RPC_URL,
                            },
                            contractAddress: {
                                type: 'string',
                                description: 'Contract address where to lookup properties for. As default there is MIKE token',
                                default: MIKE_TOKEN_ADDRESS,
                            },
                        }
                    }
                ]
            },
            response: {
                default: {
                    description: 'Get token details',
                    type: 'object',
                    properties: {
                        rpcUrl: { type: 'string' },
                        chainId: { type: 'number' },
                        contractAddress: { type: 'string' },
                        name: { type: 'string' },
                        decimals: { type: 'number' },
                        symbol: { type: 'string' },
                        totalSupply: { type: 'string' },
                    },
                },
                400: {
                    description: 'Failed to fetch information',
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        property: { type: 'string' },
                    },
                },
            },
        },
    }, async function (request, reply) {
        const provider = new JsonRpcProvider(request.query.rpcUrl)
        const [network, networkError] = await errorHandler(() => provider.getNetwork())

        if (networkError) {
            return reply.status(400).send({
                message: 'Failed to fetch information from provided RPC URL',
                property: 'rpcUrl',
            })
        }

        const contract = getContract(request.query.contractAddress, provider)
        const [properties, propertiesError] = await errorHandler(() => fetchProperties(contract))

        if (propertiesError) {
            return reply.status(400).send({
                message: 'Failed to fetch information from provided contract address',
                property: 'contractAddress',
            })
        }

        const data = {
            rpcUrl: BNB_CHAIN_RPC_URL,
            chainId: network.chainId,
            contractAddress: MIKE_TOKEN_ADDRESS,
            ...properties,
        }

        reply.send(data)
    })
}
