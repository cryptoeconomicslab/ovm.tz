#include "../models/checkpoint.ligo"
#include "../models/get_checkpoint_id.ligo"
#include "../models/extend_deposited_ranges.ligo"

function deposit_action (const s: ovm_storage; const deposit_params: deposit_params) : context is
begin
  if deposit_params.amount <= 0n
    then failwith("Insufficient fund");
  else skip;

  const storage_branch : storage_branch = get_force(deposit_params.token_type, s.branches);

  // send money to deposit contract
  const deposit_reciever : contract(unit) = get_contract(source);
  const op: operation = transaction(unit, amount, deposit_reciever);
  const ops: ops = list op end;

  // create range. Note: This variable would be used in everywhere in this deposit func
  const deposited_range: range = record
    start_ = storage_branch.total_deposited;
    end_ = storage_branch.total_deposited + deposit_params.amount;
  end;

  // create state_update
  const state_update: state_update = record
    property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
      input = "tz1OwnerN5GSez2ndXXeDX6LgUDvLzPLqgYV";
    end;
    range = deposited_range;
    plasma_block_number = s.current_block;
    deposit_address = deposit_params.token_type;
  end;

  // create checkpoint
  const checkpoint: checkpoint = record
    subrange = deposited_range;
    state_update = state_update;
  end;


  // update deposited_range global state
  // storage_branch := extend_deposited_ranges(storage_branch);

  // generate checkpointId
  // const checkpoint_id: string = get_checkpoint_id(checkpoint);

  // create checkpointStatus
  const checkpoint_status: checkpoint_status = record
    challengeable_until = 0n;
    outstanding_challenges = 0n;
  end;

  // save checkpoint to map
  // storage_branch.checkpoints[checkpointId] := checkpoint_status;

  // store log to storage (= event equivalent)
  // s.logs[now] := "deposit(token_type): source=amount"

  // IO: Extend
  s := extend_deposited_ranges(s, deposit_params);
end with ((ops:ops), s)
