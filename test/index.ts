/* eslint-disable prettier/prettier */
import chai, { expect } from "chai";
import { Contract, constants, utils, BigNumber } from "ethers";
 import { waffle } from "hardhat";
import { ecsign } from "ethereumjs-util";

import {
  domainSeparator,
  expandTo18Decimals,
  getApprovalDigest,
  //   getApprovalDigest,
  //   getTransferFromDigest,
} from "./shared/utilities";

import ERC20 from "../artifacts/contracts/BXHWorldToken.sol/BXHWorldToken.json";
const { MaxUint256 } = constants;
const { solidity, deployContract, provider } = waffle;
const { hexlify } = utils;

chai.use(solidity);
const name = "BXHWORLD";
const symbol = "BBB";
  const version = '1';

const cap = 7777777777;
const CAP = expandTo18Decimals(cap);
const INIT_CAP = expandTo18Decimals(3333333333);
const TEST_AMOUNT = expandTo18Decimals(1);
// chainId on testing is 0
let chainId: any;
  let token: Contract;
                const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

describe("BXHWorldToken", () => {
  const [wallet, other, wallet2,other2] = provider.getWallets();

  before(async () => {
    token = await deployContract(wallet, ERC20, [
      name,
      symbol,
      CAP,
      wallet.address,
    ]);
        chainId = (await token.getChainId()).toNumber();

  });

  it("name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH", async () => {
    const name = await token.name();
    expect(name).to.eq("BXHWORLD");
    expect(await token.symbol()).to.eq(symbol);
    expect(await token.decimals()).to.eq(18);
    expect(await token.cap()).to.eq(CAP);
    expect(await token.balanceOf(wallet.address)).to.eq(0);
  });
  

  
});
describe("PermitERC20", () => {
  const [wallet, other] = provider.getWallets();

  let token: Contract;
  before(async () => {
    token = await deployContract(wallet, ERC20, [
      name,
      symbol,
      CAP,
      wallet.address,
    ]);
        chainId = (await token.getChainId()).toNumber();

  });

   it('initial nonce is 0', async function () {
    expect(await token.nonces(wallet.address)).to.be.equal('0');
  });

  it('domain separator', async function () {
    expect(
      await token.DOMAIN_SEPARATOR(),
    ).to.equal(
      await domainSeparator(name, version, chainId, token.address),
    );
  });

  it("permit", async () => {
    const nonce = await token.nonces(wallet.address);
    const deadline = MaxUint256;
    const digest = await getApprovalDigest(
      version ,
  deadline ,
      chainId ,
  nonce,
   token ,
      { owner: wallet.address, spender: other.address, value: TEST_AMOUNT }
      
    );

    const { v, r, s } = ecsign(
      Buffer.from(digest.slice(2), "hex"),
      Buffer.from(wallet.privateKey.slice(2), "hex")
    );

    await expect(
      token.permit(
        wallet.address,
        other.address,
        TEST_AMOUNT,
        deadline,
        v,
        hexlify(r),
        hexlify(s)
      )
    )
      .to.emit(token, "Approval")
      .withArgs(wallet.address, other.address, TEST_AMOUNT);
    expect(await token.allowance(wallet.address, other.address)).to.eq(
      TEST_AMOUNT
    );
    expect(await token.nonces(wallet.address)).to.eq((nonce + 1));
  });
});
describe("Transactions", function () {
  // Get the ContractFactory and Signers here.

  const [wallet,wallet3, owner,other, addr1, addr2 , wallet2,other2] = provider.getWallets();

  before(async () => {
    token = await deployContract(wallet, ERC20, [
      name,
      symbol,
      CAP,
      wallet.address,
    ]);
  });
  it("Should mint ", async () => {
    expect(await token.balanceOf(wallet.address)).to.eq(0);
    await expect(token.mint(wallet.address, INIT_CAP)).to.emit(
      token,
      "Transfer"
    );
    expect(await token.balanceOf(wallet.address)).to.eq(INIT_CAP);
  });
  it("Should transfer tokens between accounts", async function () {
    const ownerBalance = await token.balanceOf(wallet.address);
    console.log(ownerBalance, "ownerBalance");

    // Transfer 50 tokens from owner to addr1
    await token.connect(wallet).transfer(addr1.address, 50);
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(50);

    // Transfer 50 tokens from addr1 to addr2
    // We use .connect(signer) to send a transaction from another account
    await token.connect(addr1).transfer(addr2.address, 50);
    const addr2Balance = await token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(50);
  });

  it("Should fail if sender doesn’t have enough tokens", async function () {
    const initialOwnerBalance = await token.balanceOf(owner.address);

    // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
    // `require` will evaluate false and revert the transaction.
    await expect(
      token.connect(addr1).transfer(owner.address, 1)
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    // Owner balance shouldn't have changed.
    expect(await token.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });
 

 
  it("approve", async () => {
    await expect(token.connect(wallet).approve(other.address, TEST_AMOUNT))
      .to.emit(token, "Approval")
      .withArgs(wallet.address, other.address, TEST_AMOUNT);
    expect(await token.allowance(wallet.address, other.address)).to.eq(
      TEST_AMOUNT
    );
  });
  it("transferFrom", async () => {
       await expect(token.mint(other2.address, TEST_AMOUNT)).to.emit(
      token,
      "Transfer"
    );
    await token.connect(other2).approve(wallet2.address, TEST_AMOUNT);
    await expect(
      token
        .connect(wallet2)
        .transferFrom(other2.address, wallet2.address, TEST_AMOUNT)
    )
      .to.emit(token, "Transfer")
      .withArgs(other2.address, wallet2.address, TEST_AMOUNT);
    expect(await token.allowance(other2.address, wallet2.address)).to.eq(0);
    expect(await token.balanceOf(other2.address)).to.eq(0);
    expect(await token.balanceOf(wallet2.address)).to.eq(TEST_AMOUNT);
  });

  it("transferFrom:max", async () => {
    await token.connect(wallet2).approve(wallet3.address, MaxUint256);
    await expect(
      token
        .connect(wallet3)
        .transferFrom(wallet2.address, wallet3.address, TEST_AMOUNT)
    )
      .to.emit(token, "Transfer")
      .withArgs(wallet2.address, wallet3.address, TEST_AMOUNT);
    expect(await token.allowance(wallet2.address, wallet3.address)).to.eq(MaxUint256)
    expect(await token.balanceOf(wallet2.address)).to.eq(0);
    expect(await token.balanceOf(wallet3.address)).to.eq(TEST_AMOUNT);
  });
});
describe("cap", function () {
  // Get the ContractFactory and Signers here.

  const [wallet, other] = provider.getWallets();

  this.beforeEach(async () => {
    token = await deployContract(wallet, ERC20, [
      name,
      symbol,
      CAP,
      wallet.address,
    ]);
  });
  it("starts with the correct cap", async function () {
    expect(await token.cap()).to.be.equal(CAP);
  });

  it("mints when amount is less than cap", async function () {
    await token.connect(wallet).mint(other.address, CAP.sub(1));
    expect(await token.totalSupply()).to.be.equal(CAP.sub(1));
  });

  it("fails to mint if the amount exceeds the cap", async function () {
     await token.mint(other.address, CAP.sub(1));
    await expect(token.mint(other.address, 2)).to.be.revertedWith(
      "ERC20Capped: cap exceeded"
    );
  });

  it("fails to mint after cap is reached", async function () {
     await token.mint(other.address, CAP);
    await expect(token.mint(other.address, 1)).to.be.revertedWith(
      "ERC20Capped: cap exceeded"
    );
  });
});

describe('increase allowance', function () {
   const [wallet, owner,other, addr1, addr2 , wallet2,other2] = provider.getWallets();

   before(async () => {
    token = await deployContract(wallet, ERC20, [
      name,
      symbol,
      CAP,
      wallet.address,
    ]);
  });
      it('emits an approval event', async function () {
          expect(
            await token.connect(wallet).increaseAllowance(other.address, TEST_AMOUNT))
            .to.emit(token,'Approval').withArgs(
            wallet.address,  other.address, TEST_AMOUNT);
        });
      it('emits an approval event', async function () {
          expect(
            await token.connect(wallet).increaseAllowance(other.address, TEST_AMOUNT))
            .to.emit(token,'Approval').withArgs(
            wallet.address,  other.address, TEST_AMOUNT);
        });
       const spender = other2.address;

      

           it('approves the requested amount', async function () {
            await token.increaseAllowance(spender, TEST_AMOUNT, { from: wallet.address });

            expect(await token.allowance(wallet.address, spender)).to.be. equal(TEST_AMOUNT);
          });
          it('increases the spender allowance adding the requested amount', async function () {
            await token.increaseAllowance(spender, TEST_AMOUNT, { from: wallet.address });

            expect(await token.allowance(wallet.address, spender)).to.be.equal(TEST_AMOUNT.mul(2));
          });
     

      it('should fail if burn is deactivated', async function () {
      await expect(token.connect(wallet).burn( expandTo18Decimals(1))).to.revertedWith
        ('ElboxahToken: Burn is disable');
    });
        
      it('should burn', async function () {
          await token.connect(wallet).activateBurn();

    await expect(token.mint(wallet.address, INIT_CAP)).to.emit(
      token,
      "Transfer"
          );
          await expect(token.burn(INIT_CAP)).to.emit(
      token,
      "Transfer"
          ).withArgs(wallet.address, ZERO_ADDRESS, INIT_CAP);

    });  
});
    