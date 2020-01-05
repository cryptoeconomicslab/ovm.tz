function get_checkpoint_id (const checkpoint: checkpoint) : bytes is
begin
  skip;
end with sha_256(bytes_pack(checkpoint));//TODO: keccak