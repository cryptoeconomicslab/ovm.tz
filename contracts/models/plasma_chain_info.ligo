function get_latest_plasma_block_number (const none : unit) : nat is
begin
  const num: nat = 0n;
end with num

function extend_deposited_ranges (const s: storage_branch) : storage_branch is
begin skip
end with s

function get_checkpoint_id (const checkpoint: checkpoint) : string is
begin skip
end with "";//keccak256(abi.encode(checkpoint.state_update, checkpoint.subrange));