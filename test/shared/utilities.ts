import ethSigUtil from "eth-sig-util";
// import { BigNumber } from "ethers";
import { Contract, providers, utils, BigNumber } from "ethers";
const { getAddress, keccak256, defaultAbiCoder, toUtf8Bytes, solidityPack } =
  utils;
export const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];
// Must match the typehash in ERC20Permit.sol
export const PERMIT_TYPEHASH: string = keccak256(
  toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
);
export const Permit = [
  { name: "owner", type: "address" },
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "deadline", type: "uint256" },
];

// export async function domainSeparator(
//   name: any,
//   version: any,
//   chainId: any,
//   verifyingContract: any
// ) {
//   return (
//     "0x" +
//     ethSigUtil.TypedDataUtils.hashStruct(
//       "EIP712Domain",
//       { name, version, chainId, verifyingContract },
//       { EIP712Domain }
//     ).toString("hex")
//   );
// }
export async function getApprovalDigest(
  version: String,
  deadline: BigNumber,
  chainId: BigNumber,
    nonce: BigNumber,
  token: Contract,
  approve: {
    owner: string;
    spender: string;
    value: BigNumber;
  }
): Promise<string> {
  const name = await token.name();
  const DOMAIN_SEPARATOR = await domainSeparator(
    name,
    version,
    chainId,
    token.address
  );
  return keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(
            ["bytes32", "address", "address", "uint256", "uint256", "uint256"],
            [
              PERMIT_TYPEHASH,
              approve.owner,
              approve.spender,
              approve.value,
              nonce,
              deadline,
            ]
          )
        ),
      ]
    )
  );
}
export async function domainSeparator(
  name: any,
  version: any,
  chainId: any,
  verifyingContract: any
) {
  return keccak256(
    defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        keccak256(
          toUtf8Bytes(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
          )
        ),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes(version)),
        chainId,
        verifyingContract,
      ]
    )
  );
}
export function expandTo18Decimals(n: number): BigNumber {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18));
}

/// Returns the Eip712 hash that must be signed by the user in order to make a call to `permit`.
