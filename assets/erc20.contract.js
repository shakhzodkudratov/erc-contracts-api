// https://www.smartcontracttoolkit.com/abi
import ERC20ABI from "./erc20.abi.json" with { type: "json" }
import { Contract as EthersContract } from "ethers"

/**
 * 
 * @param {string|import("ethers").Addressable} target 
 * @param {import("ethers").ContractRunner} runner 
 * @returns {EthersContract}
 */
export function getContract(target, runner) {
    return new EthersContract(target, ERC20ABI, runner)
}

/**
 * 
 * @param {EthersContract} contract 
 * @returns {Promise<{
 *  name: string,
 *  decimals: bigint,
 *  symbol: string,
 *  totalSupply: bigint,
 * }>}
 */
export async function fetchProperties(contract) {
    const [name, decimals, symbol, totalSupply] = await Promise.all(["name", "decimals", "symbol", "totalSupply"].map((method) => contract[method]()))
    return {
        name,
        decimals,
        symbol,
        totalSupply,
    }
}