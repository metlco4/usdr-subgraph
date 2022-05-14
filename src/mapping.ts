import {
  Approval as ApprovalEvent,
  MintFee as MintFeeEvent,
  Paused as PausedEvent,
  ReceivedMint as ReceivedMintEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
  Unpaused as UnpausedEvent,
  USDR
} from "../generated/USDR/USDR"
import {
  Approval,
  MintFee,
  Paused,
  Mint,
  RoleAdminChanged,
  Transfer,
  Unpaused,
  User,
  Role,
  ContractRole
} from "../generated/schema"
import { Address, Bytes } from "@graphprotocol/graph-ts"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleMintFee(event: MintFeeEvent): void {
  let mintId = event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  let entity = new MintFee(mintId)
  entity.mint = mintId
  entity.collector = event.params.feeCollector
  entity.feeAmount = event.params.fee
  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  entity.account = event.params.account
  entity.save()
}

export function handleReceivedMint(event: ReceivedMintEvent): void {
  let mint = new Mint(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )

  mint.recipient = event.params.receipient.toHexString()
  mint.issuedAmount = event.params.amount
  mint.transferId = event.params.transferId
  mint.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole
  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let userId = event.params.account.toHexString()
  let user = User.load(userId)

  if (!user) {
    user = new User(userId)
    user.roles = []
    user.save()
  }

  let contractRole = ContractRole.load(event.params.role.toHex())
  let name = getRoleName(event.transaction.to, event.params.role)
  if (!contractRole) {
    contractRole = new ContractRole(event.params.role.toHex())
    contractRole.name = name ? name : ""
    contractRole.save()
  }

  // check if role already assigned
  for (var i = 0; i < user.roles.length; i++) {
    let role = Role.load(user.roles[i])
    if (!role) continue

    // exit if role exists
    if (role.contractRole === contractRole.id) return
  }

  let grantedRole = new Role(event.transaction.hash.toHex() + "-" + event.transaction.index.toHex())
  grantedRole.contractRole = contractRole.id
  grantedRole.sender = event.params.sender
  grantedRole.save()

  user.roles.push(grantedRole.id)
  user.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let userId = event.params.account.toHexString()
  let user = User.load(userId)

  let contractRole = ContractRole.load(event.params.role.toHex())
  if (!user || !contractRole) return

  for (var i = 0; i < user.roles.length; i++) {
    let role = Role.load(user.roles[i])
    if (!role) continue

    // remove role
    if (role.contractRole === contractRole.id) {
      let index = user.roles.indexOf(contractRole.id)
      if (index !== -1) {
        user.roles.splice(index, 1)
      }
      user.save()
    }
  }
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  entity.account = event.params.account
  entity.save()
}

function getRoleName(contractAddress: Address | null, role: Bytes): string | null {
  if (!contractAddress) {
    return null
  }

  let usdr = USDR.bind(contractAddress)

  if (role === usdr.DEFAULT_ADMIN_ROLE()) return "ADMIN"
  if (role === usdr.BURNER_ROLE()) return "BURNER"
  if (role === usdr.FEE_CONTROLLER()) return "FEE_CONTROLLER"
  if (role === usdr.FREEZER_ROLE()) return "FREEZER"
  if (role === usdr.FROZEN_USER()) return "FROZEN"
  if (role === usdr.MINTER_ROLE()) return "MINTER"
  if (role === usdr.PAUSER_ROLE()) return "PAUSER"
  if (role === usdr.WHITELIST_USER()) return "WHITELIST"

  return null
}