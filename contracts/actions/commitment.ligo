function submit_action (const submit_params: submit_params; const s: ovm_storage) : context is
begin
  if source =/= s.operator_address then failwith("source should be registered operator address") else skip;
  if submit_params.block_number =/= s.current_block + 1 then failwith("block_number should be next block") else skip;

  s.commitments[submit_params.block_number] := submit_params.root;
  s.current_block := submit_params.block_number;
end with ((nil : list(operation)), s)
