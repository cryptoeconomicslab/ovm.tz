function submit_action (const submit_params: submit_params; const s: ovm_storage) : context is
begin
  if source =/= s.operator_address then failwith("source should be registered operator address") else skip;
  if submit_params.block_number =/= s.current_block + 1 then failwith("block_number should be next block") else skip;

  const block_number: int = submit_params.block_number;
  const block_number_string: string = submit_params.block_number_string;
  const root: string = submit_params.root;

  s.commitments[block_number] := root;
  s.current_block := block_number;

  const commitment_event: event = record
    // TODO: update current L1 block after the amendment of level
    block_height = 0;
    data = bytes_pack("{block_number:" ^ block_number_string ^ ",root:" ^ root ^ "}");
  end;
  const latest_commitment_block_event: list(event) = list
    commitment_event
  end;
  const latest_block_event: block_event = map
    "BlockSubmitted" -> latest_commitment_block_event
  end;
  // TODO: should create a event manager method because will override the other events
  s.events[block_number] := latest_block_event;
end with ((nil : list(operation)), s)
