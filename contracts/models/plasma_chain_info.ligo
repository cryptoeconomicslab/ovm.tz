function extend_deposited_ranges (const s: storage_branch) : storage_branch is
begin skip
end with s

function get_checkpoint_id (const checkpoint: checkpoint) : string is
begin skip
end with "";//keccak256(abi.encode(checkpoint.state_update, checkpoint.subrange));