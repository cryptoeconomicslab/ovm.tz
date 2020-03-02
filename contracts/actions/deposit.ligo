#include "../models/store_checkpoint.ligo"
#include "../models/extend_deposited_ranges.ligo"
#include "../models/emit_event.ligo"
#include "../utils/primitive_coder.ligo"
#include "../utils/tez_utils.ligo"

type deposit_params is record
  token_type: address;
  amount: nat;
  state_object: property;
end

function deposit_action (const deposit_params: deposit_params; const s: ovm_storage) : context is
begin
  // TODO: deposit_params.token_type isn't really working here
  // and only the tez is working here. custom token validation logic will be required later.
  if deposit_params.amount <= 0n
    then failwith("Insufficient fund");
  else skip;
  // TODO: check amount
  // if tez_to_nat(amount) =/= deposit_params.amount
  //   then failwith("Invalid amount");
  // else skip;

  const deposit_storage : deposit_storage = s.deposit_storage;

  // send money to deposit contract
  // const deposit_reciever : contract(unit) = get_contract(source);
  // const op: operation = transaction(unit, amount, deposit_reciever);
  // const ops: ops = list op end;

  const deposited_range : range = record
    start_ = deposit_storage.total_deposited;
    end_ = deposit_storage.total_deposited + deposit_params.amount;
  end;

  // create state_update
  const state_update: property = record
    // TODO: Injecting StateUpdate predicate address
    predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV" : address);
    inputs = map
      0n -> encode_address(deposit_params.token_type);
      1n -> encode_range(deposited_range);
      2n -> encode_number(s.commitment_storage.current_block);
      3n -> encode_property(deposit_params.state_object);
    end;
  end;

  const checkpoint: checkpoint = record
    subrange = deposited_range;
    state_update = state_update;
  end;

  s := store_checkpoint(s, deposit_params.token_type, checkpoint);
  s := extend_deposited_ranges(s, deposit_params.token_type, deposit_params.amount);

  // Event  
  const checkpoint_finalized_event: event_params = list
    bytes_pack(deposit_params.token_type);
    bytes_pack(get_checkpoint_id(checkpoint));
    bytes_pack(checkpoint)
  end;

  s.events_storage := emit_event(s.events_storage, "CheckpointFinalized", checkpoint_finalized_event);
end with ((nil : ops), s)
