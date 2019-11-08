function submit_action (const submit_params: submit_params; var s: ovm_storage) : context is
begin
  if source =/= s.operator_address then failwith("source should be registered operator address") else skip;
  if submit_params.block_number =/= s.current_block + 1 then failwith("block_number should be next block") else skip;

  const root: string = get_force(submit_params.block_number, s.commitments);
  root := submit_params.root;
  s.commitments[submit_params.block_number] := submit_params.root;
end with ((nil : list(operation)), s)
