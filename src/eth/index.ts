import { Address } from "../types";
import { Chain, getProvider, handleDecimals } from "../general";
import * as Tron from "../abi/tron";

export async function getBalance(params: {
  target: Address;
  block?: number;
  decimals?: number;
  chain?: Chain;
}) {
  if (params.chain === 'tron') return Tron.getBalance(params)
  const balance = await getProvider(params.chain).getBalance(
    params.target,
    params.block
  );
  return {
    output: handleDecimals(balance, params.decimals),
  };
}

// TODO: Optimize this? (not sure if worth it tho, barely any adapters use it)
export async function getBalances(params: {
  targets: Address[];
  block?: number;
  decimals?: number;
  chain?: Chain;
}) {
  if (params.chain === 'tron') return Tron.getBalances(params)
  const balances = params.targets.map(async (target) => ({
    target,
    balance: handleDecimals(
      await getProvider(params.chain).getBalance(target, params.block),
      params.decimals
    ),
  }));
  return {
    output: await Promise.all(balances),
  };
}
