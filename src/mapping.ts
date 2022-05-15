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
  }

  let role = new Role(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  role.role = event.params.role
  role.sender = event.params.sender
  role.action = "GRANT"
  role.save()

  user.roles = user.roles.concat([role.id])
  user.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let userId = event.params.account.toHexString()
  let user = User.load(userId)

  if (!user) {
    user = new User(userId)
    user.roles = []
  }

  let role = new Role(
    event.transaction.hash.toHex() + "-" + event.transaction.index.toString()
  )
  role.role = event.params.role
  role.sender = event.params.sender
  role.action = "REVOKE"
  role.save()

  user.roles = user.roles.concat([role.id])
  user.save()
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