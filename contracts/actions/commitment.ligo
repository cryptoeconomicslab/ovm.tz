function submit_action (const submit_params: submit_params; var s: ovm_storage) : context is
begin
  const root: string = get_force(submit_params.block_number, s.commitments);
  root := submit_params.root;
  s.commitments[submit_params.block_number] := submit_params.root;
end with ((nil : list(operation)), s)