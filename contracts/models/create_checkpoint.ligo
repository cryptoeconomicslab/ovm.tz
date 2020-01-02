#include "./get_checkpoint_id.ligo"

function create_checkpoint(const s: ovm_storage; const deposit_params: deposit_params; const state_update: state_update) : ovm_storage is
begin
  const storage_branch : storage_branch = get_force(deposit_params.token_type, s.branches);

  const checkpoint: checkpoint = record
    subrange = state_update.range;
    state_update = state_update;
  end;

  const checkpoint_id: bytes = get_checkpoint_id(checkpoint);

  const checkpoint_status: checkpoint_status = record
    challengeable_until = 0n;//TODO:level
    outstanding_challenges = 0n;
  end;

  storage_branch.checkpoints[checkpoint_id] := checkpoint_status;

  s.branches[deposit_params.token_type] := storage_branch;
end with s;