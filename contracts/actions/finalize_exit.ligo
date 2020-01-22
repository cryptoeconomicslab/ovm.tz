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
  const deposit_storage: storage_branch;
  const range_to_remove: range;
  const deposited_range_id: nat
) : storage_branch is
begin 
  const encompasing_range: range = get_force(deposited_range_id, deposit_storage.deposited_ranges);
  if encompasing_range.start_ <= range_to_remove.start_ and range_to_remove.end_ <= encompasing_range.end_
  then skip
  else failwith("range must be of a depostied range.");

  const new_deposited_ranges: map(nat, range) = deposit_storage.deposited_ranges;
  // check start
  if range_to_remove.start_ =/= encompasing_range.start_
  then deposit_storage.deposited_ranges[range_to_remove.end_] := record
    start_ = encompasing_range.start_;
    end_ = range_to_remove.end_;
  end
  else skip;
  // check end
  if range_to_remove.end_ = encompasing_range.end_
  then deposit_storage.deposited_ranges := map_remove(encompasing_range.end_, deposit_storage.deposited_ranges)
  else encompasing_range.start_ := range_to_remove.end_;
  deposit_storage.deposited_ranges[encompasing_range.end_] := encompasing_range;
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
  const new_exit: exit = record
    subrange = decode_range(get_force(0n, finalize_exit_params.exit_property.inputs));
    state_update = decode_property(get_force(1n, finalize_exit_params.exit_property.inputs));
  end;
  // remove deposited range
  s.branches[finalize_exit_params.token_type] := remove_deposited_range(
    get_force(finalize_exit_params.token_type, s.branches),
    new_exit.subrange,
    finalize_exit_params.deposited_range_id
  );
  // transfer
  const state_object: property = decode_property(get_force(3n, new_exit.state_update.inputs));
  const owner_opt: option(address) = decode_address(get_force(0n, state_object.inputs));
  const withdraw_amount: int = new_exit.subrange.end_ - new_exit.subrange.start_;
  const operations: list(operation) = list end;
  case owner_opt of
    | Some(owner) -> operations := transfer(owner, nat_to_tez(abs(withdraw_amount))) # operations
    | None -> failwith("decode error")
  end;
  // store event
  const exit_finalized_event: event_params = ExitFinalizedEvent(
    (
      finalize_exit_params.token_type,
      get_exit_id(new_exit)
    )
  );
  s.events_storage := emit_event(s.events_storage, "ExitFinalized", exit_finalized_event);
end with ((operations : ops), s)

function test_remove_deposited_range(
  const params: (range * nat);
  const s: storage_branch
) : ( ops * storage_branch ) is
begin skip end with ( (nil:ops) , remove_deposited_range( s, params.0, params.1))
