function extend_deposited_ranges (
  const s: ovm_storage;
  const token_type: address;
  const deposited_amount: nat
) : ovm_storage is
begin 
  const storage_branch : storage_branch = get_force(token_type, s.branches);

  const is_deposited_range_null: bool = case storage_branch.deposited_ranges[storage_branch.total_deposited] of
  | Some (range) -> False
  | None -> True
  end;
  if is_deposited_range_null then failwith("No range found for the old total_deposited.") else skip;
  const old_deposited_range: range = get_force(storage_branch.total_deposited, storage_branch.deposited_ranges);
  const old_start: nat = old_deposited_range.start_;
  const old_end: nat = old_deposited_range.end_;
  const new_start: nat = 0n;//temporal variable
  const new_deposited_ranges: map(nat, range) = storage_branch.deposited_ranges;//temporal variable

  if (bitwise_and(old_start = 0n, old_end = 0n)) then
    // Creat a new range when the rightmost range has been removed
    new_start := storage_branch.total_deposited;
  else begin
    // Delete the old range and make a new one with the total length
    new_deposited_ranges := map_remove(old_end, new_deposited_ranges);
    new_start := old_start;
  end;

  const new_end: nat = storage_branch.total_deposited + deposited_amount;

  // update temporal variable(branch state clone)
  storage_branch.total_deposited := storage_branch.total_deposited + deposited_amount;
  const new_deposited_range: range = record
    start_ = new_start;
    end_ = new_end;
  end;
  new_deposited_ranges[new_end] := new_deposited_range;

  // override branch state
  storage_branch.deposited_ranges := new_deposited_ranges;
  s.branches[token_type] := storage_branch;
end with s;