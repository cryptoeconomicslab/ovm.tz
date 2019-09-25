#include "../models/checkpoint.ligo"
#include "../models/plasma_chain_info.ligo"

function deposit_action (const deposit_params: deposit_params; const s: ovm_storage) : context is
begin
  if deposit_params.amount <= 0n then fail "Insufficient fund" else skip;
  const storage_branch : storage_branch = get_force(deposit_params.token_type, s.branches);

  // send money to deposit contract
  const deposit_reciever : contract(unit) = get_contract(source);
  const op: operation = transaction(unit, amount, deposit_reciever);
  const ops: ops = list op end;


  // create range
  const depositedRange: range = record
    start_ = storage_branch.total_deposited;
    end_ = storage_branch.total_deposited + deposit_params.amount;
  end;

  // create state_update
  const state_update: state_update = record
    property = record
      predicate_address = ("tz1TGu6TN5GSez2ndXXeDX6LgUDvLzPLqgYV":address);
      input = "tz";
    end;
    range = depositedRange;
    plasma_block_number = get_latest_plasma_block_number(unit);
    deposit_address = deposit_params.token_type;
  end;
  // create checkpoint
  const checkpoint: checkpoint = record
    subrange = depositedRange;
    state_update = state_update;
  end;

  // update depositedRange global state
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

  // This line wasn't compiled but this sample implies it's possible
  // https://gitlab.com/ligolang/ligo/blob/dev/src/contracts/coase.ligo#L84-87
  // s.branches[deposit_params.token_type] := storage_branch;
end with ((ops:ops), s)
