#include "../models/emit_event.ligo"
#include "../types/index.ligo"
#include "../utils/primitive_coder.ligo"
#include "../utils/tez_utils.ligo"

type finalize_exit_params is record
  token_type: token_type;
  exit_property: property;
  deposited_range_id: nat;
end

function remove_deposited_range (
  const deposit_storage: deposit_storage;
  const range_to_remove: range;
  const deposited_range_id: nat
) : deposit_storage is
begin 
  const encompasing_range : range = 
  case deposit_storage.deposited_ranges[deposited_range_id] of
    Some(encompasing_range) -> encompasing_range
  | None -> ( failwith("No deposited_range_id.") : range )
  end;

  if encompasing_range.start_ <= range_to_remove.start_ and range_to_remove.end_ <= encompasing_range.end_
  then skip
  else failwith("range must be of a depostied range.");

  const new_deposited_ranges: map(nat, range) = deposit_storage.deposited_ranges;
  // check start
  if range_to_remove.start_ =/= encompasing_range.start_
  then deposit_storage.deposited_ranges[range_to_remove.start_] := record
    start_ = encompasing_range.start_;
    end_ = range_to_remove.start_;
  end
  else skip;
  // check end
  if range_to_remove.end_ = encompasing_range.end_
  then deposit_storage.deposited_ranges := map_remove(encompasing_range.end_, deposit_storage.deposited_ranges)
  else begin
    encompasing_range.start_ := range_to_remove.end_;
    deposit_storage.deposited_ranges[encompasing_range.end_] := encompasing_range;
  end;
end with deposit_storage;

function get_exit_id(const exit: exit) : bytes is
begin
  skip;
end with sha_256(bytes_pack(exit));

function transfer(const account: address; const amount_: tez) : operation is
begin
  const contract : contract(unit) = get_contract(account);
  const op: operation = transaction(unit, amount_, contract);
end with op;

function finalize_exit_action(
  const finalize_exit_params: finalize_exit_params;
  const s: ovm_storage
) : context is
begin
  // TODO: check adjudication.isDecided(finalize_exit_params.exit_property)
  const range_bin1 : bytes = 
  case finalize_exit_params.exit_property.inputs[0n] of
    Some(range_bin) -> range_bin
  | None -> ( failwith("No range binary.") : bytes )
  end;
  const prop_bin1 : bytes = 
  case finalize_exit_params.exit_property.inputs[1n] of
    Some(prop_bin) -> prop_bin
  | None -> ( failwith("No property binary.") : bytes )
  end;
  const new_exit: exit = record
    subrange = decode_range(range_bin1);
    state_update = decode_property(prop_bin1);
  end;

  // remove deposited range
  const deposit_storage : deposit_storage = 
  case s.deposit_storages[finalize_exit_params.token_type] of
    Some(deposit_storage) -> deposit_storage
  | None -> ( failwith("No token type.") : deposit_storage )
  end;
  s.deposit_storages[finalize_exit_params.token_type] := remove_deposited_range(
    deposit_storage,
    new_exit.subrange,
    finalize_exit_params.deposited_range_id
  );
  // transfer
  const prop_bin2 : bytes = 
  case new_exit.state_update.inputs[3n] of
    Some(prop_bin2) -> prop_bin2
  | None -> ( failwith("No property binary.") : bytes )
  end;
  const state_object: property = decode_property(prop_bin2);

  const addr_bin : bytes = 
  case state_object.inputs[0n] of
    Some(addr_bin) -> addr_bin
  | None -> ( failwith("No address binary.") : bytes )
  end;
  const owner_opt: option(address) = decode_address(addr_bin);
  const withdraw_amount: int = new_exit.subrange.end_ - new_exit.subrange.start_;
  const operations: list(operation) = list end;
  case owner_opt of
    | Some(owner) -> operations := transfer(owner, nat_to_tez(abs(withdraw_amount))) # operations
    | None -> failwith("decode error")
  end;

  // Emit event
  const exit_finalized_event: event_params = list
    bytes_pack(finalize_exit_params.token_type);
    bytes_pack(get_exit_id(new_exit));
  end;
  s.events_storage := emit_event(s.events_storage, "ExitFinalized", exit_finalized_event);
end with ((operations : ops), s)
