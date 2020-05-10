function extend_deposited_ranges (
  const s: ovm_storage;
  const token_type: address;
  const deposited_amount: nat
) : ovm_storage is
begin 
  const deposit_storage : deposit_storage = 
  case s.deposit_storages[token_type] of
    Some(deposit_storage) -> deposit_storage
  | None -> ( failwith("No token type.") : deposit_storage )
  end;

  const is_deposited_range_null: bool = case deposit_storage.deposited_ranges[deposit_storage.total_deposited] of
  | Some (range) -> False
  | None -> True
  end;
  if is_deposited_range_null then failwith("No range found for the old total_deposited.") else skip;

  const old_deposited_range : range = 
  case deposit_storage.deposited_ranges[deposit_storage.total_deposited] of
    Some(range) -> range
  | None -> ( failwith("No old_deposited_range.") : range )
  end;
  const old_start: nat = old_deposited_range.start_;
  const old_end: nat = old_deposited_range.end_;
  const new_start: nat = 0n;//temporal variable
  const new_deposited_ranges: map(nat, range) = deposit_storage.deposited_ranges;//temporal variable

  if (bitwise_and(old_start = 0n, old_end = 0n)) then
    // Creat a new range when the rightmost range has been removed
    new_start := deposit_storage.total_deposited;
  else begin
    // Delete the old range and make a new one with the total length
    new_deposited_ranges := map_remove(old_end, new_deposited_ranges);
    new_start := old_start;
  end;

  const new_end: nat = deposit_storage.total_deposited + deposited_amount;

  // update temporal variable(branch state clone)
  deposit_storage.total_deposited := deposit_storage.total_deposited + deposited_amount;
  const new_deposited_range: range = record
    start_ = new_start;
    end_ = new_end;
  end;
  new_deposited_ranges[new_end] := new_deposited_range;

  // override branch state
  deposit_storage.deposited_ranges := new_deposited_ranges;
  s.deposit_storages[token_type] := deposit_storage;
end with s;