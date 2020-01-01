function get_checkpoint_id (const checkpoint: checkpoint) : string is
begin skip
end with "";//keccak256(abi.encode(checkpoint.state_update, checkpoint.subrange));